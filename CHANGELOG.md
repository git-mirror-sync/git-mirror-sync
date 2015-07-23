# Change Log

## [v1.1.4](https://github.com/obihann/git-mirror-sync/tree/v1.1.4) (2015-07-23)
[Full Changelog](https://github.com/obihann/git-mirror-sync/compare/v1.1.3...v1.1.4)

**Fixed bugs:**

- user profile page has active link to github auth [\#61](https://github.com/obihann/git-mirror-sync/issues/61)
- store session secret as an environment variable [\#59](https://github.com/obihann/git-mirror-sync/issues/59)
- we are only checking the queue when the worker starts [\#55](https://github.com/obihann/git-mirror-sync/issues/55)
- profile doesn't update after BitBucket authentication [\#47](https://github.com/obihann/git-mirror-sync/issues/47)

**Merged pull requests:**

- Develop [\#69](https://github.com/obihann/git-mirror-sync/pull/69) ([obihann](https://github.com/obihann))
- fixing bitbucket object not being stored in session user [\#68](https://github.com/obihann/git-mirror-sync/pull/68) ([obihann](https://github.com/obihann))
- hiding session in a env variable [\#67](https://github.com/obihann/git-mirror-sync/pull/67) ([obihann](https://github.com/obihann))
- Fixing profiles [\#66](https://github.com/obihann/git-mirror-sync/pull/66) ([obihann](https://github.com/obihann))

## [v1.1.3](https://github.com/obihann/git-mirror-sync/tree/v1.1.3) (2015-07-16)
[Full Changelog](https://github.com/obihann/git-mirror-sync/compare/1.1.2...v1.1.3)

## [1.1.2](https://github.com/obihann/git-mirror-sync/tree/1.1.2) (2015-07-16)
[Full Changelog](https://github.com/obihann/git-mirror-sync/compare/v0.3.1...1.1.2)

**Implemented enhancements:**

- test if the user has validated with bitbucket prior to running worker [\#62](https://github.com/obihann/git-mirror-sync/issues/62)

**Fixed bugs:**

- when a message in the queue fails we cannot proceed [\#56](https://github.com/obihann/git-mirror-sync/issues/56)

**Merged pull requests:**

- adding null check to match undefined user check [\#64](https://github.com/obihann/git-mirror-sync/pull/64) ([obihann](https://github.com/obihann))
- adding more loggign and error checking [\#63](https://github.com/obihann/git-mirror-sync/pull/63) ([obihann](https://github.com/obihann))
- properly nack'ing messages from rabbit on failure [\#60](https://github.com/obihann/git-mirror-sync/pull/60) ([obihann](https://github.com/obihann))

## [v0.3.1](https://github.com/obihann/git-mirror-sync/tree/v0.3.1) (2015-07-15)
[Full Changelog](https://github.com/obihann/git-mirror-sync/compare/v1.0.0-beta...v0.3.1)

**Implemented enhancements:**

- Drop user permission for GitHub [\#50](https://github.com/obihann/git-mirror-sync/issues/50)
- Add basic logging [\#17](https://github.com/obihann/git-mirror-sync/issues/17)
- Check if access tokens have expired [\#13](https://github.com/obihann/git-mirror-sync/issues/13)

**Fixed bugs:**

- Fix responsive bugs [\#48](https://github.com/obihann/git-mirror-sync/issues/48)

**Closed issues:**

- Create a dev BitBucket app [\#45](https://github.com/obihann/git-mirror-sync/issues/45)
- Create a dev GitHub app [\#44](https://github.com/obihann/git-mirror-sync/issues/44)

**Merged pull requests:**

- adding logging [\#54](https://github.com/obihann/git-mirror-sync/pull/54) ([obihann](https://github.com/obihann))
- adding additional logging [\#53](https://github.com/obihann/git-mirror-sync/pull/53) ([obihann](https://github.com/obihann))
- new bootstrap based layout [\#52](https://github.com/obihann/git-mirror-sync/pull/52) ([obihann](https://github.com/obihann))
- cleaning schema and scope [\#51](https://github.com/obihann/git-mirror-sync/pull/51) ([obihann](https://github.com/obihann))

## [v1.0.0-beta](https://github.com/obihann/git-mirror-sync/tree/v1.0.0-beta) (2015-07-07)
[Full Changelog](https://github.com/obihann/git-mirror-sync/compare/v0.3.0...v1.0.0-beta)

**Implemented enhancements:**

- Create team in BitBucket if one does not exist matching the GitHub "organization" [\#39](https://github.com/obihann/git-mirror-sync/issues/39)

## [v0.3.0](https://github.com/obihann/git-mirror-sync/tree/v0.3.0) (2015-07-06)
[Full Changelog](https://github.com/obihann/git-mirror-sync/compare/v0.2.1-beta...v0.3.0)

**Implemented enhancements:**

- Add google analytics [\#16](https://github.com/obihann/git-mirror-sync/issues/16)
- add logout button [\#15](https://github.com/obihann/git-mirror-sync/issues/15)

**Closed issues:**

- 'Schema' is defined but never used. [\#42](https://github.com/obihann/git-mirror-sync/issues/42)
- 'Schema' is defined but never used. [\#41](https://github.com/obihann/git-mirror-sync/issues/41)

**Merged pull requests:**

- Rabbitmq [\#46](https://github.com/obihann/git-mirror-sync/pull/46) ([obihann](https://github.com/obihann))
- more cleanup of codacy tickets [\#43](https://github.com/obihann/git-mirror-sync/pull/43) ([obihann](https://github.com/obihann))

## [v0.2.1-beta](https://github.com/obihann/git-mirror-sync/tree/v0.2.1-beta) (2015-07-06)
[Full Changelog](https://github.com/obihann/git-mirror-sync/compare/v0.2.0...v0.2.1-beta)

**Closed issues:**

- 'mongoose' is defined but never used. [\#32](https://github.com/obihann/git-mirror-sync/issues/32)
- Rule is empty. [\#31](https://github.com/obihann/git-mirror-sync/issues/31)
- 'e' is defined but never used. [\#30](https://github.com/obihann/git-mirror-sync/issues/30)
- 'bbRes' is defined but never used. [\#29](https://github.com/obihann/git-mirror-sync/issues/29)
- Expected '===' and instead saw '=='. [\#28](https://github.com/obihann/git-mirror-sync/issues/28)
- 'code' is defined but never used. [\#27](https://github.com/obihann/git-mirror-sync/issues/27)
- 'bb\_secret' is defined but never used. [\#26](https://github.com/obihann/git-mirror-sync/issues/26)
- 'bb\_client' is defined but never used. [\#25](https://github.com/obihann/git-mirror-sync/issues/25)
- 'ObjectId' is defined but never used. [\#24](https://github.com/obihann/git-mirror-sync/issues/24)
- 'user' is defined but never used. [\#21](https://github.com/obihann/git-mirror-sync/issues/21)
- 'GitHubApi' is defined but never used. [\#20](https://github.com/obihann/git-mirror-sync/issues/20)
- 'ObjectId' is defined but never used. [\#19](https://github.com/obihann/git-mirror-sync/issues/19)

**Merged pull requests:**

- this closes \#19 [\#38](https://github.com/obihann/git-mirror-sync/pull/38) ([obihann](https://github.com/obihann))
- Codacy [\#37](https://github.com/obihann/git-mirror-sync/pull/37) ([obihann](https://github.com/obihann))
- fixing code styling and removing unused variables [\#36](https://github.com/obihann/git-mirror-sync/pull/36) ([obihann](https://github.com/obihann))

## [v0.2.0](https://github.com/obihann/git-mirror-sync/tree/v0.2.0) (2015-07-06)
[Full Changelog](https://github.com/obihann/git-mirror-sync/compare/v0.2.0-beta...v0.2.0)

## [v0.2.0-beta](https://github.com/obihann/git-mirror-sync/tree/v0.2.0-beta) (2015-07-06)
[Full Changelog](https://github.com/obihann/git-mirror-sync/compare/v0.1.0...v0.2.0-beta)

**Implemented enhancements:**

- Allow users to toggle the add or remove the commit hook via the website [\#12](https://github.com/obihann/git-mirror-sync/issues/12)
- Add a basic user interface [\#11](https://github.com/obihann/git-mirror-sync/issues/11)
- Add users accounts with GitHub OAuth [\#6](https://github.com/obihann/git-mirror-sync/issues/6)
- Connect to BitBucket API with OAuth [\#5](https://github.com/obihann/git-mirror-sync/issues/5)
- allow users to backup repos not owned by a group / org [\#4](https://github.com/obihann/git-mirror-sync/issues/4)

**Fixed bugs:**

- Start using unique id's for foldernames when checking out repos [\#14](https://github.com/obihann/git-mirror-sync/issues/14)
- Create missing repositories on BitBucket [\#8](https://github.com/obihann/git-mirror-sync/issues/8)

**Merged pull requests:**

- Passport [\#10](https://github.com/obihann/git-mirror-sync/pull/10) ([obihann](https://github.com/obihann))
- adding ouath 1 [\#3](https://github.com/obihann/git-mirror-sync/pull/3) ([obihann](https://github.com/obihann))

## [v0.1.0](https://github.com/obihann/git-mirror-sync/tree/v0.1.0) (2015-06-27)
**Merged pull requests:**

- adding testing and code coverage [\#1](https://github.com/obihann/git-mirror-sync/pull/1) ([obihann](https://github.com/obihann))



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*