
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportRequest {
  format: 'pdf' | 'csv' | 'json';
  scope: 'complete' | 'date_range' | 'journal_only' | 'assessments_only';
  startDate?: string;
  endDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { format, scope, startDate, endDate }: ExportRequest = await req.json();

    console.log(`Starting export for user ${user.id}: ${format} format, ${scope} scope`);

    // Start background processing for large exports
    if (format === 'pdf' || scope === 'complete') {
      EdgeRuntime.waitUntil(processLargeExport(user.id, format, scope, startDate, endDate));
      
      return new Response(JSON.stringify({ 
        message: 'Export started. You will receive an email when ready.',
        status: 'processing'
      }), {
        status: 202,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Process smaller exports immediately
    const exportData = await generateExport(user.id, format, scope, startDate, endDate);
    
    return new Response(JSON.stringify(exportData), {
      status: 200,
      headers: { 
        'Content-Type': format === 'csv' ? 'text/csv' : 'application/json',
        'Content-Disposition': `attachment; filename="export_${Date.now()}.${format}"`,
        ...corsHeaders 
      },
    });

  } catch (error: any) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

async function generateExport(userId: string, format: string, scope: string, startDate?: string, endDate?: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  let whereClause = `user_id = '${userId}'`;
  if (startDate && endDate) {
    whereClause += ` AND created_at BETWEEN '${startDate}' AND '${endDate}'`;
  }

  const data: any = {};

  // Fetch data based on scope
  if (scope === 'complete' || scope === 'journal_only') {
    const { data: journalEntries } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId);
    data.journalEntries = journalEntries || [];
  }

  if (scope === 'complete' || scope === 'assessments_only') {
    const { data: responses } = await supabase
      .from('question_responses')
      .select(`
        *,
        assessment_questions(question_text, category)
      `)
      .eq('user_id', userId);
    data.assessmentResponses = responses || [];

    const { data: patterns } = await supabase
      .from('assessment_patterns')
      .select('*')
      .eq('user_id', userId);
    data.assessmentPatterns = patterns || [];
  }

  if (scope === 'complete') {
    const { data: checkins } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId);
    data.dailyCheckins = checkins || [];

    const { data: sessions } = await supabase
      .from('dialogue_sessions')
      .select(`
        *,
        dialogue_exchanges(*),
        dialogue_assessments(*)
      `)
      .eq('user_id', userId);
    data.dialogueSessions = sessions || [];
  }

  if (format === 'csv') {
    return generateCSV(data, scope);
  }

  if (format === 'json') {
    return data;
  }

  return data;
}

function generateCSV(data: any, scope: string): string {
  let csv = '';

  if (data.journalEntries && data.journalEntries.length > 0) {
    csv += 'Journal Entries\n';
    csv += 'Date,Title,Content,Tags,Mood Score\n';
    data.journalEntries.forEach((entry: any) => {
      const content = entry.content.replace(/"/g, '""').substring(0, 500);
      const tags = entry.tags ? entry.tags.join(';') : '';
      csv += `"${entry.created_at}","${entry.title || ''}","${content}","${tags}","${entry.mood_score || ''}"\n`;
    });
    csv += '\n';
  }

  if (data.assessmentResponses && data.assessmentResponses.length > 0) {
    csv += 'Assessment Responses\n';
    csv += 'Date,Question,Category,Score,Notes\n';
    data.assessmentResponses.forEach((response: any) => {
      const question = response.assessment_questions?.question_text || '';
      const category = response.assessment_questions?.category || '';
      const notes = response.response_notes ? response.response_notes.replace(/"/g, '""') : '';
      csv += `"${response.created_at}","${question}","${category}","${response.response_score}","${notes}"\n`;
    });
    csv += '\n';
  }

  return csv;
}

async function processLargeExport(userId: string, format: string, scope: string, startDate?: string, endDate?: string) {
  try {
    console.log(`Processing large export for user ${userId}`);
    
    const exportData = await generateExport(userId, format, scope, startDate, endDate);
    
    if (format === 'pdf') {
      const pdfData = await generatePDFReport(exportData);
      await sendExportEmail(userId, pdfData, 'pdf');
    } else {
      await sendExportEmail(userId, exportData, format);
    }

    console.log(`Large export completed for user ${userId}`);
  } catch (error) {
    console.error('Large export error:', error);
  }
}

async function generatePDFReport(data: any): Promise<string> {
  // Simplified PDF generation - in production, use a proper PDF library
  const reportContent = {
    title: 'Personal Insights Report',
    generatedAt: new Date().toISOString(),
    summary: {
      totalJournalEntries: data.journalEntries?.length || 0,
      totalAssessments: data.assessmentResponses?.length || 0,
      dateRange: 'All time'
    },
    data: data
  };

  return JSON.stringify(reportContent, null, 2);
}

async function sendExportEmail(userId: string, exportData: any, format: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data: user } = await supabase.auth.admin.getUserById(userId);
  
  if (!user?.user?.email) {
    console.error('No email found for user');
    return;
  }

  const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

  const attachment = {
    filename: `export_${Date.now()}.${format}`,
    content: format === 'json' ? JSON.stringify(exportData, null, 2) : exportData
  };

  await resend.emails.send({
    from: 'Insights Export <noreply@yourdomain.com>',
    to: [user.user.email],
    subject: 'Your Data Export is Ready',
    html: `
      <h2>Your Data Export is Complete</h2>
      <p>Your requested ${format.toUpperCase()} export has been generated and is attached to this email.</p>
      <p>This export contains your personal insights and journal data.</p>
      <p>If you have any questions, please contact our support team.</p>
    `,
    attachments: [attachment]
  });
}

serve(handler);
