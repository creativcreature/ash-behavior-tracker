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

interface Animal {
  name: string
  emoji: string
}

const ANIMALS: Animal[] = [
  { name: 'Panda', emoji: '🐼' },
  { name: 'Dolphin', emoji: '🐬' },
  { name: 'Elephant', emoji: '🐘' },
  { name: 'Lion', emoji: '🦁' },
  { name: 'Tiger', emoji: '🐯' },
  { name: 'Bear', emoji: '🐻' },
  { name: 'Fox', emoji: '🦊' },
  { name: 'Koala', emoji: '🐨' },
  { name: 'Penguin', emoji: '🐧' },
  { name: 'Owl', emoji: '🦉' },
  { name: 'Butterfly', emoji: '🦋' },
  { name: 'Bunny', emoji: '🐰' },
  { name: 'Turtle', emoji: '🐢' },
  { name: 'Unicorn', emoji: '🦄' },
  { name: 'Monkey', emoji: '🐵' },
  { name: 'Giraffe', emoji: '🦒' },
  { name: 'Zebra', emoji: '🦓' },
  { name: 'Otter', emoji: '🦦' },
  { name: 'Hedgehog', emoji: '🦔' },
  { name: 'Dragon', emoji: '🐉' },
  { name: 'Sloth', emoji: '🦥' },
  { name: 'Flamingo', emoji: '🦩' },
  { name: 'Peacock', emoji: '🦚' },
  { name: 'Seal', emoji: '🦭' },
  { name: 'Llama', emoji: '🦙' },
  { name: 'Raccoon', emoji: '🦝' },
  { name: 'Puppy', emoji: '🐶' },
  { name: 'Kitten', emoji: '🐱' },
  { name: 'Chick', emoji: '🐣' },
  { name: 'Frog', emoji: '🐸' },
]

/**
 * Generates a unique playful animal name by combining a random adjective with a random animal.
 * Checks existing children in the database to ensure uniqueness.
 *
 * @returns An object containing the generated name and emoji
 */
export async function generateAnimalName(): Promise<{ name: string; emoji: string }> {
  const maxAttempts = 100
  let attempts = 0

  while (attempts < maxAttempts) {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
    const name = `${adjective} ${animal.name}`

    // Check if this name already exists
    const existing = await db.children
      .where('animalName')
      .equals(name)
      .first()

    if (!existing) {
      return { name, emoji: animal.emoji }
    }

    attempts++
  }

  // Fallback: add a number suffix if we couldn't find a unique name
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  const timestamp = Date.now() % 1000

  return {
    name: `${adjective} ${animal.name} ${timestamp}`,
    emoji: animal.emoji,
  }
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

/**
 * Gets a random animal emoji.
 *
 * @returns A random animal emoji string
 */
export function getRandomAnimalEmoji(): string {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)].emoji
}
