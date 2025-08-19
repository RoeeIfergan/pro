import { relations } from 'drizzle-orm'
import { screens } from './screen.schema.ts'
import { steps } from './step.schema.ts'
import { transitions } from './transition.schema.ts'

export const screenRelations = relations(screens, ({ many }) => ({
  steps: many(steps),
  transitions: many(transitions)
}))

export const transitionsRelations = relations(transitions, ({ one }) => ({
  fromSteps: one(steps, {
    fields: [transitions.fromStepId],
    references: [steps.id]
  }),
  toSteps: one(steps, {
    fields: [transitions.toStepId],
    references: [steps.id]
  }),
  screens: one(screens, {
    fields: [transitions.screenId],
    references: [screens.id]
  })
}))

export const stepsRelations = relations(steps, ({ one }) => ({
  screen: one(screens, {
    fields: [steps.screenId],
    references: [screens.id]
  })
}))
