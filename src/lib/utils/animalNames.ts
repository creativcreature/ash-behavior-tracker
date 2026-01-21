import { db } from '../storage/db'

const ADJECTIVES = [
  'Brave',
  'Happy',
  'Playful',
  'Cheerful',
  'Gentle',
  'Curious',
  'Friendly',
  'Clever',
  'Mighty',
  'Sweet',
  'Bold',
  'Joyful',
  'Bright',
  'Calm',
  'Wise',
  'Energetic',
  'Peaceful',
  'Strong',
  'Kind',
  'Creative',
  'Spirited',
  'Radiant',
  'Sunny',
  'Sparkly',
  'Bouncy',
]

const ANIMALS: string[] = [
  'Panda',
  'Dolphin',
  'Elephant',
  'Lion',
  'Tiger',
  'Bear',
  'Fox',
  'Koala',
  'Penguin',
  'Owl',
  'Butterfly',
  'Bunny',
  'Turtle',
  'Unicorn',
  'Monkey',
  'Giraffe',
  'Zebra',
  'Otter',
  'Hedgehog',
  'Dragon',
  'Sloth',
  'Flamingo',
  'Peacock',
  'Seal',
  'Llama',
  'Raccoon',
  'Puppy',
  'Kitten',
  'Chick',
  'Frog',
]

/**
 * Generates a unique playful animal name by combining a random adjective with a random animal.
 * Checks existing children in the database to ensure uniqueness.
 *
 * @returns The generated name
 */
export async function generateAnimalName(): Promise<string> {
  const maxAttempts = 100
  let attempts = 0

  while (attempts < maxAttempts) {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
    const name = `${adjective} ${animal}`

    // Check if this name already exists
    const existing = await db.children
      .where('animalName')
      .equals(name)
      .first()

    if (!existing) {
      return name
    }

    attempts++
  }

  // Fallback: add a number suffix if we couldn't find a unique name
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  const timestamp = Date.now() % 1000

  return `${adjective} ${animal} ${timestamp}`
}

/**
 * Checks if an animal name is already in use.
 *
 * @param name The animal name to check
 * @returns True if the name is available, false if it's already in use
 */
export async function isAnimalNameAvailable(name: string): Promise<boolean> {
  const existing = await db.children
    .where('animalName')
    .equals(name)
    .first()

  return !existing
}

