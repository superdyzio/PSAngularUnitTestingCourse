import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeadingText() {
    return element(by.css('app-root h1')).getText();
  }

  getNavigationItems() {
    return element.all(by.css('app-root nav a')).map(el => el.getText());
  }
}
