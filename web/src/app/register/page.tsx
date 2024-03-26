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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register } from '@/actions'

const RegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirm_password: z.string().min(8),
  })
  .refine(data => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })

export default function Page() {
  const [alert, setAlert] = useState({
    error: '',
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
      const response = await register(email, password)

      if (!response.success) {
        setAlert({ error: response.message })
        return
      }

      push('/login')
    } catch (error) {
      console.error(error)
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
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input id="confirm_password" placeholder="Confirm Password" {...field} />
                        </FormControl>
                        <FormDescription>This is your public display name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Link href="/login" className="text-sm text-blue-500">
                  {' '}
                  Already have an account? Login
                </Link>
                <CardFooter className="flex justify-end">
                  <Button>Register</Button>
                </CardFooter>

                {alert && <p className="text-red-500">{alert.error}</p>}
              </form>
            </Form>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
