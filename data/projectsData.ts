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
  {
    title: 'Homebridge SmartRent Plugin',
    description: `TypeScript-based Homebridge plugin enabling HomeKit integration
    for SmartRent smart home installations. Control locks, thermostats, and switches
    through Apple's ecosystem with native support.`,
    imgSrc: '/static/images/projects/homebridge-smartrent.svg',
    href: 'https://github.com/BitWise-0x/homebridge-smartrent',
  },
]

export default projectsData
