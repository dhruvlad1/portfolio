import { BadgeCheck, FileText, Globe, Mail } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { SiCodechef, SiCodeforces, SiLeetcode } from 'react-icons/si'

function GitHubIcon({ size = 16 }) {
  return <FaGithub size={size} className="link-icon link-icon--brand" aria-hidden="true" focusable="false" />
}

function LinkedInIcon({ size = 16 }) {
  return <FaLinkedin size={size} className="link-icon link-icon--brand" aria-hidden="true" focusable="false" />
}

function MailIcon({ size = 16 }) {
  return <Mail size={size} strokeWidth={1.75} aria-hidden="true" className="link-icon link-icon--warm" />
}

function LiveIcon({ size = 16 }) {
  return <Globe size={size} strokeWidth={1.75} aria-hidden="true" className="link-icon link-icon--warm" />
}

function ResumeIcon({ size = 16 }) {
  return <FileText size={size} strokeWidth={1.75} aria-hidden="true" className="link-icon" />
}

function BadgeIcon({ size = 16 }) {
  return <BadgeCheck size={size} strokeWidth={1.75} aria-hidden="true" className="link-icon" />
}

function LeetCodeIcon({ size = 16 }) {
  return <SiLeetcode size={size} className="link-icon link-icon--brand" aria-hidden="true" focusable="false" />
}

function CodeChefIcon({ size = 16 }) {
  return <SiCodechef size={size} className="link-icon link-icon--brand" aria-hidden="true" focusable="false" />
}

function CodeforcesIcon({ size = 16 }) {
  return <SiCodeforces size={size} className="link-icon link-icon--brand" aria-hidden="true" focusable="false" />
}

export {
  BadgeIcon,
  CodeChefIcon,
  CodeforcesIcon,
  GitHubIcon,
  LeetCodeIcon,
  LinkedInIcon,
  LiveIcon,
  MailIcon,
  ResumeIcon,
}
