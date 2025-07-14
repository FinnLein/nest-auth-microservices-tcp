import { Body, Heading, Html, Tailwind, Text } from '@react-email/components'
import * as React from 'react'

interface TwoFactorProps {
	token: string
}

export function TwoFactorAuthTemplate({ token }: TwoFactorProps) {

	return (
	<Tailwind>
		<Html>
			<Body className='text-black'>
				<Heading>
					 Two factor Authentication  
				</Heading>
				<Text>Your two factor auth code: <strong>{token}</strong></Text>
				<Text>Please enter this code to complete authentication.</Text>
				<Text>If you did not request this code ignore this message</Text>
				<Text>Thanks for using us!</Text>
			</Body>
		</Html>
	</Tailwind>
	)
}