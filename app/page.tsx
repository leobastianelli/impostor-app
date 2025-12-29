'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            El Impostor
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            ¿Quién está mintiendo?
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 text-center">
              Bienvenido
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-zinc-700 dark:text-zinc-300">
              Un juego social donde todos reciben la misma palabra excepto uno: el impostor.
              Deben dar pistas relacionadas con su personaje para descubrir quién miente.
            </p>

            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Cómo Jugar:
              </h3>
              <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
                <li>1. Crea una sala o únete con un código</li>
                <li>2. Todos reciben un personaje argentino</li>
                <li>3. El impostor recibe un personaje diferente</li>
                <li>4. Dan pistas por turnos sobre su personaje</li>
                <li>5. Debaten y votan por quién creen que es el impostor</li>
                <li>6. Si descubren al impostor, el grupo gana. Si no, gana el impostor</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Link href="/create" className="w-full">
                <Button className="w-full" size="lg">
                  Crear Sala
                </Button>
              </Link>
              <Link href="/join" className="w-full">
                <Button className="w-full" size="lg" variant="secondary">
                  Unirse a Sala
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Requisitos:
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                3-12 jugadores • Cada jugador en su propio dispositivo
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
