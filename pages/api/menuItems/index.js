// pages/api/menuitems/index.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const menuItems = await prisma.menuItem.findMany({
        include: {
          tags: true,
          category: true
        },
      })
      res.status(200).json(menuItems)
      break

    case 'POST':
      const { name, description, price, imgPath, isTodaysBest, isWeeklyBest, categoryId, tagIds } = req.body

      // Create or find tags
      const tags = await Promise.all(tagIds.map(async (tagId) => {
        return prisma.tag.findUnique({ where: { id: tagId } })
      }))

      const menuItem = await prisma.menuItem.create({
        data: {
          name,
          description,
          price,
          imgPath,
          isTodaysBest,
          isWeeklyBest,
          category: categoryId ? { connect: { id: categoryId } } : undefined,
          tags: tagIds.length > 0 ? { connect: tags.map(tag => ({ id: tag.id })) } : undefined
        }
      })
      res.status(201).json(menuItem)
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
