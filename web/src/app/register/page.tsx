'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

import Container from '@/components/ui/container'
import Section from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { register } from '@/actions'
import { Routes } from '@/contstants'
import Alert from '@/components/ui/alert'
import { RegisterSchema } from '@/zodSchemas'

export default function Page() {
  const [alert, setAlert] = useState({
    submitType: false,
    text: '',
  })

  const { push } = useRouter()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    const { email, password } = data

    try {
      const { message, success } = await register(email, password)
      if (!success) {
        setAlert({ submitType: success, text: message })
        return
      }

      if (success) {
        setAlert({ submitType: success, text: message })
        setTimeout(() => {
          push(Routes.LOGIN)
        }, 500)
      }

      if (!success) setAlert({ submitType: success, text: message })
    } catch (error) {
      setAlert({ submitType: false, text: 'Failed to register.' })
    }
  }

  return (
    <Section description="Register">
      <Container width="2xl" className="mt-24">
        <Card className="w-[400px] sm:w-[564px]">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
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

                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          id="confirm_password"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>This is your public display name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Link href={Routes.LOGIN} className="text-sm font-medium text-blue-600">
                  {' '}
                  Already have an account? Login
                </Link>
                <CardFooter className="flex justify-end">
                  <Button>Register</Button>
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
