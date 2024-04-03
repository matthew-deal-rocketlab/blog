'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Container from '@/components/ui/container'
import Section from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { login } from '@/actions'
import { useAuth } from '@/context/authProvider'
import { Routes } from '@/contstants'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export default function Page() {
  const [alert, setAlert] = useState({
    error: '',
  })
  const { push } = useRouter()
  const { login: loginProvider } = useAuth()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const { email, password } = data

    try {
      const { token, message } = await login(email, password)

      if (token) {
        loginProvider(token)
      }

      if (message === 'Login successful.') {
        push(Routes.HOME)
      }

      if (message) {
        setAlert({ error: message })
      }
    } catch (error) {
      setAlert({ error: 'Failed to login.' })
    }
  }

  return (
    <Section description="Register">
      <Container width="2xl" className="mt-24">
        <Card className="w-[400px] sm:w-[564px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input id="email" placeholder="Email Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input id="password" placeholder="Password" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Link href={Routes.REGISTER} className="text-sm text-blue-500">
                  {' '}
                  Don&apos;t have an account? Signup
                </Link>
                <CardFooter className="flex justify-end">
                  <Button>Login</Button>
                </CardFooter>
                {alert.error && <div className="text-red-500">{alert.error}</div>}
              </form>
            </Form>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
