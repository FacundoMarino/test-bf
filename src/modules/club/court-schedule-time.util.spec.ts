import {
  effectiveEndTimeMinutes,
  isValidScheduleTimeRange,
  scheduleDurationMinutes,
} from './court-schedule-time.util';

describe('court-schedule-time.util', () => {
  it('treats 00:00 end as midnight same day', () => {
    expect(effectiveEndTimeMinutes(9 * 60, 0)).toBe(24 * 60);
    expect(isValidScheduleTimeRange(9 * 60, 0)).toBe(true);
    expect(scheduleDurationMinutes(9 * 60, 0)).toBe(15 * 60);
  });

  it('treats 01:00 end as next-day close', () => {
    expect(effectiveEndTimeMinutes(21 * 60, 60)).toBe(25 * 60);
    expect(isValidScheduleTimeRange(21 * 60, 60)).toBe(true);
    expect(scheduleDurationMinutes(21 * 60, 60)).toBe(4 * 60);
  });

  it('rejects equal start and end', () => {
    expect(isValidScheduleTimeRange(9 * 60, 9 * 60)).toBe(false);
  });
});
