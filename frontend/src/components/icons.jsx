import { BadgeCheck, FileText, Globe, Mail } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'

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

export { BadgeIcon, GitHubIcon, LinkedInIcon, LiveIcon, MailIcon, ResumeIcon }
