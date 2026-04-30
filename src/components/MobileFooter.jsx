"use client";
import { BookOpen, MessageCircle, Star, Phone, Download } from "lucide-react";
import Link from "next/link";

const MobileFooter = () => {
  return (
    <div className="mobile-footer">
      <Link href="/courses" className="footer-item">
        <BookOpen size={20} />
        <span>Courses</span>
      </Link>

      <Link href="/chat" className="footer-item">
        <MessageCircle size={20} />
        <span>Chat</span>
      </Link>

     
      <div className="footer-center">
        <Star size={22} />
      </div>

      <Link href="/contact" className="footer-item">
        <Phone size={20} />
        <span>Contact</span>
      </Link>

      <Link href="/brochure" className="footer-item">
        <Download size={20} />
        <span>Brochure</span>
      </Link>
    </div>
  );
};

export default MobileFooter;