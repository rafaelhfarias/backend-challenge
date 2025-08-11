import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  await prisma.athleteCategory.deleteMany()
  await prisma.athlete.deleteMany()
  await prisma.school.deleteMany()
  await prisma.sport.deleteMany()
  await prisma.category.deleteMany()

  const schoolsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'sample-data', 'schools.json'), 'utf-8'))
  const sportsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'sample-data', 'sports.json'), 'utf-8'))
  const categoriesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'sample-data', 'categories.json'), 'utf-8'))
  const athletesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'sample-data', 'athletes.json'), 'utf-8'))

  console.log('Seeding schools...')
  for (const school of schoolsData) {
    await prisma.school.create({
      data: {
        id: school.id,
        label: school.label,
        name: school.name,
        state: school.state,
        conference: school.conference,
      },
    })
  }

  console.log('Seeding sports...')
  for (const sport of sportsData) {
    await prisma.sport.create({
      data: {
        id: sport.id,
        label: sport.label,
        name: sport.name,
      },
    })
  }

  console.log('Seeding categories...')
  for (const category of categoriesData) {
    await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
      },
    })
  }

  console.log('Seeding athletes...')
  const athletesToSeed = athletesData.slice(0, 100)
  
  for (const athlete of athletesToSeed) {
    const sportIds = athlete.sports.map((sport: any) => sport.id)
    
    const athleteData = {
      id: athlete.id,
      name: athlete.name,
      email: athlete.email,
      gender: athlete.gender,
      isAlumni: athlete.isAlumni,
      grade: athlete.grade,
      isActive: athlete.isActive,
      needsReview: athlete.needsReview,
      schoolId: athlete.school.id,
      
      score: athlete.currentScore.score,
      totalFollowers: athlete.currentScore.totalFollowers,
      engagementRate: athlete.currentScore.engagementRate,
      audienceQualityScore: athlete.currentScore.audienceQualityScore,
      contentPerformanceScore: athlete.currentScore.contentPerformanceScore,
      
      instagramUsername: athlete.platforms.instagram?.username,
      instagramUserId: athlete.platforms.instagram?.platformUserId,
      instagramFollowers: athlete.platforms.instagram?.followers,
      instagramFollowing: athlete.platforms.instagram?.following,
      instagramPosts: athlete.platforms.instagram?.posts,
      instagramEngagementRate: athlete.platforms.instagram?.engagementRate,
      instagramAvgLikes: athlete.platforms.instagram?.avgLikes,
      instagramAvgComments: athlete.platforms.instagram?.avgComments,
      
      tiktokUsername: athlete.platforms.tiktok?.username,
      tiktokUserId: athlete.platforms.tiktok?.platformUserId,
      tiktokFollowers: athlete.platforms.tiktok?.followers,
      tiktokFollowing: athlete.platforms.tiktok?.following,
      tiktokPosts: athlete.platforms.tiktok?.posts,
      tiktokEngagementRate: athlete.platforms.tiktok?.engagementRate,
      tiktokAvgLikes: athlete.platforms.tiktok?.avgLikes,
      tiktokAvgComments: athlete.platforms.tiktok?.avgComments,
      
      age: athlete.demographics.age,
      ageRange: athlete.demographics.ageRange,
      ethnicityHispanic: athlete.demographics.ethnicity.hispanic,
      ethnicityWhite: athlete.demographics.ethnicity.white,
      ethnicityBlack: athlete.demographics.ethnicity.black,
      ethnicityAsian: athlete.demographics.ethnicity.asian,
      ethnicityOther: athlete.demographics.ethnicity.other,
      audienceGenderMale: athlete.demographics.audienceGender.male,
      audienceGenderFemale: athlete.demographics.audienceGender.female,
      locationUs: athlete.demographics.location.us,
      locationMexico: athlete.demographics.location.mexico,
      locationCanada: athlete.demographics.location.canada,
      locationOther: athlete.demographics.location.other,
      topCities: JSON.stringify(athlete.demographics.topCities),
      audienceAge13_17: athlete.demographics.audienceAge['13-17'],
      audienceAge18_24: athlete.demographics.audienceAge['18-24'],
      audienceAge25_34: athlete.demographics.audienceAge['25-34'],
      audienceAge35_44: athlete.demographics.audienceAge['35-44'],
      audienceAge45Plus: athlete.demographics.audienceAge['45+'],
      interests: JSON.stringify(athlete.demographics.interests),
      
      sports: {
        connect: sportIds.map((id: number) => ({ id }))
      }
    }

    const createdAthlete = await prisma.athlete.create({
      data: athleteData,
      include: {
        school: true,
        sports: true,
      }
    })

    if (athlete.categories) {
      for (const category of athlete.categories) {
        await prisma.athleteCategory.create({
          data: {
            athleteId: createdAthlete.id,
            categoryId: category.id,
            confidenceScore: category.confidenceScore,
          },
        })
      }
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
