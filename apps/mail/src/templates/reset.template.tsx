import { Body, Heading, Html, Link, Tailwind, Text } from '@react-email/components'
import * as React from 'react'

interface ResetProps {
	domain: string
	token: string
}

export function ResetTemplate({ domain, token }: ResetProps) {
	const resetLink = `${domain}/auth/new-pass?token=${token}`

	return (
	<Tailwind>
		<Html>
			<Body className='text-black'>
				<Heading>
					 Password reset 
				</Heading>
				<Text>Hello! You requested password reset. In order to create a new password please follow the link below:</Text>
				<Link href={resetLink}>Reset password</Link>
				<Text>This link is available within 1 hour. If you did not request confirmation, please ignore this message.</Text>
				<Text>Thanks for using us!</Text>
			</Body>
		</Html>
	</Tailwind>
	)
}