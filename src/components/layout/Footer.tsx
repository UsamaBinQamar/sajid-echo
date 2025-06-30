
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-12 mt-16 border-t border-border theme-transition">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground font-body text-professional-sm">
              © 2025 EchoStrong™. A product of Strong Vision and Clarity, LLC. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex space-x-6 text-professional-sm">
              <Link 
                to="/terms-of-service" 
                className="text-foreground hover:text-primary theme-transition"
              >
                Terms of Service
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link 
                to="/privacy-policy" 
                className="text-foreground hover:text-primary theme-transition"
              >
                Privacy Policy
              </Link>
            </div>
            <div className="text-professional-sm font-body">
              <span className="text-muted-foreground">Contact:</span>{" "}
              <a 
                href="mailto:hello@echostrong.app" 
                className="text-foreground hover:text-primary theme-transition"
              >
                hello@echostrong.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
