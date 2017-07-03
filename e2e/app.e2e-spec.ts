import { DriverPlannerPage } from './app.po';

describe('driver-planner App', () => {
  let page: DriverPlannerPage;

  beforeEach(() => {
    page = new DriverPlannerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
