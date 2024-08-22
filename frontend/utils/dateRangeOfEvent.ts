import { config } from "project.config"

export const dateRangeOfEvent = `${new Date(
  config.startDate,
).toLocaleDateString("de", {
  day: "numeric",
  month: "numeric",
})} - ${new Date(config.endDate).toLocaleDateString("de")}`

export const dateRangeOfEventLong = `${new Date(
  config.startDate,
).toLocaleDateString("de", {
  weekday: "long",
  day: "numeric",
  month: "numeric",
})} bis ${new Date(config.endDate).toLocaleDateString("de", {
  weekday: "long",
  day: "numeric",
  month: "numeric",
  year: "numeric",
})}`
