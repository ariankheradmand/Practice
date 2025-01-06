// pages/api/menuitems/[id].js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const id = req.query.id

  switch (req.method) {
    case 'PUT':
      const { name, description, price, imgPath, isTodaysBest, isWeeklyBest, categoryId, tagIds } = req.body

      // Update tags separately before updating the main item
      await prisma.menuItem.update({
        where: { id },
        data: {
          tags: tagIds.length > 0 ? { set: tagIds.map(id => ({ id })) } : undefined,
        }
      })

      const updatedMenuItem = await prisma.menuItem.update({
        where: { id },
        data: {
          name,
          description,
          price,
          imgPath,
          isTodaysBest,
          isWeeklyBest,
          category: categoryId ? { connect: { id: categoryId } } : undefined
        }
      })
      res.status(201).json(updatedMenuItem)
      break

    case 'DELETE':
      const deletedMenuItem = await prisma.menuItem.delete({
        where: { id },
      })
      // Note: Sending status 204 (No Content) and still sending JSON might be confusing. 
      // Consider just sending res.status(204).end() if no content should be returned.
      res.status(204).json(deletedMenuItem)
      break

    default:
      res.setHeader('Allow', ['PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}