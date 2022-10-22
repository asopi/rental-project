export class DateUtil {
  public static getDays(fromDate: Date, toDate: Date) {
    let difference = toDate.getTime() - fromDate.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  }
}
