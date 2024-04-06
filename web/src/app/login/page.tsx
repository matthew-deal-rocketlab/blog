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
import { useEffect, useState } from 'react'
import { login } from '@/actions'
import { useAuth } from '@/context/authProvider'
import { KEY_JWT_TOKEN, Routes } from '@/contstants'
import { cookieStoreRemove } from '@/utils/cookie-store'
import Alert from '@/components/ui/alert'
import { LoginSchema } from '@/zodSchemas'

export default function Page() {
  const [alert, setAlert] = useState({
    submitType: false,
    text: '',
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

  useEffect(() => {
    const removeToken = async () => {
      cookieStoreRemove(KEY_JWT_TOKEN)
    }

    removeToken()
  }, [])

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const { email, password } = data

    try {
      const { token, message, success } = await login(email, password)

      if (token) loginProvider(token)

      if (success) {
        setAlert({ submitType: success, text: message })
        setTimeout(() => {
          push(Routes.HOME)
        }, 500)
      }

      if (!success) setAlert({ submitType: success, text: message })
    } catch (error) {
      setAlert({ submitType: false, text: 'Failed to login.' })
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" id="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Link href={Routes.REGISTER} className="text-sm font-medium text-blue-600">
                  {' '}
                  Don&apos;t have an account? Signup
                </Link>
                <CardFooter className="flex justify-end">
                  <Button>Login</Button>
                </CardFooter>
                {alert.text && <Alert submitType={alert.submitType} text={alert.text} />}
              </form>
            </Form>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
