import { AppPage } from './app.po';

describe('AppPage', () => {
  let page : AppPage;

  beforeEach(() => {
    page = new AppPage();

    page.navigateTo();
  });

  it('should show correct header', () => {
    const expectedHeader = 'Tour of Heroes';

    expect(page.getHeadingText()).toEqual(expectedHeader);
  });

  it('should show correct navigation items', () => {
    const expectedNavigationItems = ['Dashboard', 'Heroes'];

    expect(page.getNavigationItems()).toEqual(expectedNavigationItems);
  });
});
