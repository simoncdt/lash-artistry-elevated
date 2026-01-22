export const combineDateAndTimeToUTC = (
  date: string,
  time: string
): Date => {
  return new Date(`${date}T${time}:00Z`);
};

export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};
