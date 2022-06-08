# 50.003-TwentyCent-WebApp

## Latest TODO (for Proj Meeting 4) 
- [ ] db/server integration with PostGres
- [x] CSV Function: Not fetching the values properly from this.state
- [x] snapshot testing using jest 
- [ ] UI testing: addTenant function, add checklist 
- [x] fuzzing using selenium: login page 
- [ ] separate login flows for staff/tenant
## Notes
- update 17 of react-test-renderer has some dependency, use older test-renderer @16.9 ```npm i react-test-renderer@16.9 --save-dev```
- npm install --save-dev react-native-reanimated
- https://www.browserstack.com/guide/automation-using-selenium-javascript ```npm install –save selenium-webdriver```
- testing branch includes jest and selenium

## Types of Testing

### Blackbox
- [x] snapshot testing of each UI component: whether react-native components are rendered correctly
- [ ] fuzzing and UI testing using selenium

### Whitebox
