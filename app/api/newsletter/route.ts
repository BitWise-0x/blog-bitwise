import { NewsletterAPI } from 'pliny/newsletter'
import siteMetadata from '@/data/siteMetadata'

const validProviders = [
  'buttondown',
  'convertkit',
  'klaviyo',
  'mailchimp',
  'emailoctopus',
  'beehiiv',
] as const

type NewsletterProvider = (typeof validProviders)[number]

const provider = siteMetadata.newsletter?.provider
if (provider && !validProviders.includes(provider as NewsletterProvider)) {
  throw new Error(`Invalid newsletter provider: ${provider}`)
}

const handler = NewsletterAPI({
  provider: provider as NewsletterProvider,
})

export { handler as GET, handler as POST }
