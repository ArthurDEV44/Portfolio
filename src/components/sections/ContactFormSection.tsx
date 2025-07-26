'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Card, CardContent, Input, Textarea } from '@/components';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CheckCircle, AlertCircle } from 'lucide-react';

// Schéma de validation avec Zod
const formSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  workEmail: z.string().email('Veuillez entrer une adresse email valide'),
  subject: z.string().min(5, 'L\'objet doit contenir au moins 5 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type FormData = z.infer<typeof formSchema>;

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function ContactFormSection() {
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      workEmail: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setStatus({ type: 'loading' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setStatus({ 
          type: 'success', 
          message: result.message
        });
        
        // Réinitialiser le formulaire après succès
        form.reset();
      } else {
        setStatus({ 
          type: 'error', 
          message: result.message || 'Une erreur s\'est produite lors de l\'envoi de votre message.' 
        });
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setStatus({ 
        type: 'error', 
        message: 'Une erreur s\'est produite. Veuillez réessayer ou me contacter directement.' 
      });
    }
  };

  return (
    <section id="contact-form" className="py-20 px-4 bg-gradient-to-b from-black via-zinc-900/10 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-1 gap-12 items-start">
          {/* Right Column - Form */}
          <Card className="bg-black backdrop-blur-md border-zinc-700/50 rounded-3xl shadow-2xl shadow-white/10">
            <CardContent className="p-8 pt-2 pb-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Prénom *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Votre prénom"
                              className="bg-zinc-800/20 border-zinc-600 text-white placeholder-zinc-400 focus:ring-sky-500 py-5"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Nom *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Votre nom"
                              className="bg-zinc-800/20 border-zinc-600 text-white placeholder-zinc-400 focus:ring-sky-500 py-5"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="workEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Email professionnel *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="votre@email.com"
                            className="bg-zinc-800/20 border-zinc-600 text-white placeholder-zinc-400 focus:ring-sky-500 py-5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subject */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Objet *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Développement web, Application SaaS, Consultation..."
                            className="bg-zinc-800/20 border-zinc-600 text-white placeholder-zinc-400 focus:ring-sky-500 py-5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Message *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            placeholder="Décrivez votre projet, vos besoins, vos objectifs..."
                            className="bg-zinc-800/20 border-zinc-600 text-white placeholder-zinc-400 focus:ring-sky-500 resize-vertical"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status Messages */}
                  {status.type === 'success' && (
                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <p className="text-green-400 text-sm">{status.message}</p>
                    </div>
                  )}

                  {status.type === 'error' && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-400 text-sm">{status.message}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || status.type === 'loading'}
                    className="w-full bg-sky-500 hover:bg-sky-400 text-white py-6 rounded-full font-medium text-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {status.type === 'loading' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer
                      </>
                    )}
                  </Button>

                  {/* Privacy Note */}
                  <p className="text-xs text-zinc-500 text-center">
                    En soumettant ce formulaire, vous acceptez que vos données soient utilisées 
                    pour vous recontacter concernant votre demande.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 