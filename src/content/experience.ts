import type { WorkExperience, Education, Certification } from '../types/content'

export const workExperience: WorkExperience[] = [
  {
    id: 'northstar-property-maintenance',
    company: 'Northstar Property Maintenance',
    role: 'Technical Lead',
    startDate: '2021-06-01',
    endDate: undefined,
    current: true,
    location: 'Royse City, TX',
    summary: 'Technical lead for a property maintenance company, managing the company website, employee email systems, and operational tools.',
    responsibilities: [
      'Spearheaded the design, development, and management of the company website, ensuring a user-friendly interface and updated content',
      'Implemented and managed employee email systems, providing prompt resolution to technical issues and ensuring seamless communication across the organization',
      'Developed efficient, customized bid templates using Google Docs, streamlining the proposal process and enhancing operational productivity',
      'Innovated a proprietary GMix Calculator using Excel, Python, and React, optimizing material usage and cost-effectiveness in operations',
    ],
    technologies: ['React', 'Python', 'Excel', 'Google Workspace', 'Email Systems'],
  },
  {
    id: 'paveworks',
    company: 'PaveWorks',
    role: 'Paver Operator',
    startDate: '2020-06-01',
    endDate: '2023-08-31',
    current: false,
    location: 'McKinney, TX',
    summary: 'Operated and maintained heavy machinery for paving projects while coordinating logistics with site crews and truck drivers.',
    responsibilities: [
      'Expertly operated a range of heavy machinery, including skid steers, excavators, rollers, and pavers, contributing to high-quality construction outcomes',
      'Coordinated logistics and workflow with truck drivers and site workers, ensuring efficient project execution and adherence to timelines',
      'Undertook regular maintenance and repair of heavy equipment, maximizing operational uptime and ensuring adherence to safety standards',
    ],
    technologies: ['Heavy Equipment Operation', 'Equipment Maintenance', 'Safety Compliance', 'Skid Steers', 'Excavators', 'Pavers'],
  },
  {
    id: 'usic',
    company: 'USIC',
    role: 'Utility Locate Technician / Trainer',
    startDate: '2024-01-01',
    endDate: undefined,
    current: true,
    location: 'East Texas',
    summary: 'Locate and mark underground utilities, manage high-volume ticket workloads, and train new technicians in field procedures and safety.',
    responsibilities: [
      'Locate and mark underground utility lines using electronic locating equipment, utility prints, access points, and field verification procedures to support safe excavation and damage prevention',
      'Manage high daily ticket volumes across assigned territories by prioritizing due dates, emergencies, project footage, travel time, and changing workload demands',
      'Interpret utility maps, prints, field conditions, and transmitter and receiver signals while using RD8200 equipment and established troubleshooting techniques',
      'Train and support new technicians in locating procedures, equipment operation, safety practices, documentation standards, ticket workflow, and field productivity',
      'Document completed work with accurate measurements, photographs, ticket remarks, timestamps, and locate details in accordance with company and customer requirements',
      'Communicate with contractors, homeowners, excavation crews, supervisors, and utility representatives to resolve conflicts and provide clear locate-status updates',
    ],
    technologies: ['RD8200', 'Utility Locating', 'Damage Prevention', '811 Ticket Management', 'Field Documentation', 'Training & Coaching'],
  },
]

export const education: Education[] = [
  {
    id: 'new-apprenticeship',
    institution: 'New Apprenticeship',
    degree: 'Data Analytics Learner',
    field: 'Data Analytics, SQL, and Tableau',
    startDate: '2022-07-01',
    endDate: '2022-07-01',
    current: false,
  },
  {
    id: 'dev-mission',
    institution: 'dev/Mission',
    degree: 'Dev Mission',
    field: 'HTML, CSS, and Computer Technology',
    startDate: '2022-01-01',
    endDate: '2022-01-01',
    current: false,
  },
  {
    id: 'coursera',
    institution: 'Coursera',
    degree: 'Web Development Certificates',
    field: 'Front-End, Back-End, and Git/GitHub',
    startDate: '2023-01-01',
    endDate: '2023-12-01',
    current: false,
  },
]

export const certifications: Certification[] = [
  {
    id: 'dev-mission-cert',
    name: 'Dev Mission',
    issuer: 'dev/Mission',
  },
  {
    id: 'new-apprenticeship-python-tableau',
    name: 'New Apprenticeship Python/Tableau',
    issuer: 'New Apprenticeship',
  },
  {
    id: 'intro-web-dev',
    name: 'Introduction to Web Development with HTML, CSS, JavaScript',
    issuer: 'Coursera',
    url: 'https://coursera.org/share/d1a554c742b7164bad2995aca1fc755e',
    image: '/assets/certificates/coursera-introhtml.jpg',
  },
  {
    id: 'frontend-react',
    name: 'Developing Front-End Apps with React',
    issuer: 'Coursera',
    url: 'https://coursera.org/share/eb4f89350f336cbae13f9a81c02b54ed',
    image: '/assets/certificates/coursera-frontend.jpg',
  },
  {
    id: 'backend-node',
    name: 'Developing Back-End Apps with Node.js and Express',
    issuer: 'Coursera',
    url: 'https://coursera.org/share/4e3b6f9b0ce0cb9c52c2fc3dc0177f33',
    image: '/assets/certificates/coursera-backend.jpg',
  },
  {
    id: 'github-cert',
    name: 'Getting Started with Git and GitHub',
    issuer: 'Coursera',
    url: 'https://coursera.org/share/c0fa859c34998ac8d577a29085c30077',
    image: '/assets/certificates/coursera-git.jpg',
  },
]

export const achievements = [
  '2.5 years of underground utility locating experience with hands-on field training and damage prevention',
  'Skilled in utility print interpretation, electronic locating equipment (RD8200), 811 ticket management, and field documentation',
  'Proven ability to operate and maintain heavy equipment, including skid steers, excavators, rollers, and pavers',
  'Built practical software tools using React, Python, and Excel to improve operational productivity',
  'Recognized for working independently, adapting to changing priorities, and communicating with contractors and customers',
]
