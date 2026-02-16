interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'HumeChat',
    description: `Expressive Voice Intelligence platform powered by Hume AI EVI. Real-time
    voice conversations with multi-persona AI, Jungian archetype assessments, emotion
    detection, and 3D audio visualizations. Built with Next.js 15, React 19, and Three.js.`,
    imgSrc: '/static/images/projects/humechat.svg',
    href: 'https://humechat.com',
  },
  {
    title: 'MongoDB Replica Set Manager',
    description: `Production-ready MongoDB replica set controller for Docker Swarm.
    Automates deployment, scaling, and failover of MongoDB clusters in containerized
    environments with high availability guarantees.`,
    imgSrc: '/static/images/projects/mongodb-manager.svg',
    href: 'https://github.com/BitWise-0x/MongoDB-ReplicaSet-Manager',
  },
  // {
  //   title: 'Orchestration Stacks',
  //   description: `Curated collection of self-hosted Docker Swarm stacks for deploying
  //   and managing orchestration services. Includes monitoring, logging, CI/CD, and
  //   infrastructure management solutions.`,
  //   imgSrc: '/static/images/projects/orchestration-stacks.svg',
  //   href: 'https://github.com/BitWise-0x/Orchestration-Stacks',
  // },
  {
    title: 'Homebridge SmartRent Plugin',
    description: `TypeScript-based Homebridge plugin enabling HomeKit integration
    for SmartRent smart home installations. Control locks, thermostats, and switches
    through Apple's ecosystem with native support.`,
    imgSrc: '/static/images/projects/homebridge-smartrent.svg',
    href: 'https://github.com/BitWise-0x/homebridge-smartrent',
  },
  // {
  //   title: 'SymBot - DCA Trading Bot',
  //   description: `User-friendly, self-hosted cryptocurrency DCA (Dollar Cost Averaging)
  //   bot. Automates trading strategies with configurable parameters, risk management,
  //   and comprehensive logging.`,
  //   imgSrc: '/static/images/projects/symbot.svg',
  //   href: 'https://github.com/BitWise-0x/SymBot',
  // },
  // {
  //   title: 'AI Infrastructure Stacks',
  //   description: `Self-hosted AI service stacks for Docker Swarm. Deploy LLMs,
  //   vector databases, and ML pipelines with production-grade configuration and
  //   resource management.`,
  //   imgSrc: '/static/images/projects/ai-stacks.svg',
  //   href: 'https://github.com/BitWise-0x/Ai-Stacks',
  // },
]

export default projectsData
