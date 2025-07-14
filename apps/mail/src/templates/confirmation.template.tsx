import { Body, Heading, Html, Link, Tailwind, Text } from '@react-email/components'
import * as React from 'react'
interface ConfirmationProps {
	domain: string
	token: string
}

export function ConfirmationTemplate({ domain, token }: ConfirmationProps) {
	const confirmLink = `${domain}/auth/email-verification?token=${token}`

	return (
	<Tailwind>
		<Html>
			<Body className='text-black'>
				<Heading>
					 Mail Confirmation
				</Heading>
				<Text>Hello! In order to confirm your email please follow the link below.</Text>
				<Link href={confirmLink}>Confirm email:</Link>
				<Text>This ling is available within 1 hour. If you did not request confirmation, please ignore this message.</Text>
				<Text>Thanks for using us!</Text>
			</Body>
		</Html>
	</Tailwind>
	)
}