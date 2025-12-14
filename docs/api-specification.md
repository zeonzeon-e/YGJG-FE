# Yogijogi Application Backend API 1.0.0

- **Base URL:** `http://54.180.123.45:8080/`
- **Docs URL:** `/v2/api-docs`

---

## 목차

1. [Admin Join Team Controller](#admin-join-team-controller)
2. [Admin Team Controller](#admin-team-controller)
3. [Announcement Controller](#announcement-controller)
4. [Auth Controller](#auth-controller)
5. [Join Team Controller](#join-team-controller)
6. [Member Controller](#member-controller)
7. [My Page Controller](#my-page-controller)
8. [Search Team Controller](#search-team-controller)
9. [Sign Controller](#sign-controller)
10. [Team Controller](#team-controller)
11. [Team Strategy Controller](#team-strategy-controller)
12. [Test Controller](#test-controller)
13. [Test D Controller](#test-d-controller)

---

## Admin Join Team Controller

### `POST` /api/admin/joinTeam/{teamId}/accept/{memberId}

**Operation:** `acceptJoinRequest`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **memberId** \*     | memberId                              | integer($int64) | path     |
| **teamId** \*       | teamId                                | integer($int64) | path     |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `POST` /api/admin/joinTeam/{teamId}/deny/{memberId}

**Operation:** `denyJoinRequest`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **memberId** \*     | memberId                              | integer($int64) | path     |
| **teamId** \*       | teamId                                | integer($int64) | path     |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `GET` /api/admin/joinTeam/getPendingRequests/{teamId}

**Operation:** `getPendingRequests`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **position**        | position (Default: 전체)              | string          | query    |
| **teamId** \*       | teamId                                | integer($int64) | path     |

**Responses**

- **200 OK**

```json
[
  {
    "joinTeamId": 0,
    "name": "string",
    "position": "string",
    "profileUrl": "string"
  }
]
```

---

### `GET` /api/admin/joinTeam/requestDetail/{requestId}

**Operation:** `requestDetail`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **requestId** \*    | requestId                             | integer($int64) | path     |

**Responses**

- **200 OK**

```json
{
  "address": "string",
  "gender": "string",
  "hasExperience": true,
  "joinReason": "string",
  "level": "string",
  "memberId": 0,
  "name": "string",
  "position": "string",
  "profileUrl": "string",
  "teamId": 0
}
```

---

## Admin Team Controller

### `PUT` /api/admin/team/grantManagerRole

**Operation:** `grantManagerRole`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **teamMemberId** \* | teamMemberId                          | integer($int64) | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `PUT` /api/admin/team/updateSubManagerRole

**Operation:** `updateSubManagerRole`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **grant** \*        | grant                                 | boolean         | query    |
| **teamMemberId** \* | teamMemberId                          | integer($int64) | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

## Announcement Controller

### `POST` /api/announcement/manager/create

**Operation:** `createAnnouncement`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **content**         | content                               | string          | query    |
| **image**           | image                                 | file            | formData |
| **teamId**          | teamId                                | integer($int64) | query    |
| **title**           | title                                 | string          | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `GET` /api/announcement/manager/delete

**Operation:** `deleteAnnouncement`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **announcementId**  | announcementId                        | integer($int64) | query    |
| **teamId**          | teamId                                | integer($int64) | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `GET` /api/announcement/manager/detail

**Operation:** `getManagerAnnouncementDetails`

**Parameters**

| Name                  | Description                           | Type            | Location |
| :-------------------- | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \*   | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **announcementId** \* | announcementId                        | integer($int64) | query    |
| **teamId** \*         | teamId                                | integer($int64) | query    |

**Responses**

- **200 OK**

```json
{
  "announcementId": 0,
  "content": "string",
  "createdAt": "2025-12-14T18:04:03.043Z",
  "imageUrl": "string",
  "title": "string",
  "updatedAt": "2025-12-14T18:04:03.043Z",
  "writer": "string"
}
```

---

### `GET` /api/announcement/manager/get-all

**Operation:** `getAllManagerAnnouncements`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **teamId**          | teamId                                | integer($int64) | query    |

**Responses**

- **200 OK**

```json
[
  {
    "createAt": "2025-12-14T18:04:03.044Z",
    "id": 0,
    "title": "string"
  }
]
```

---

### `PUT` /api/announcement/manager/update

**Operation:** `updateAnnouncement`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **announcementId**  | announcementId                        | integer($int64) | query    |
| **content**         | content                               | string          | query    |
| **image**           | image                                 | file            | formData |
| **teamId**          | teamId                                | integer($int64) | query    |
| **title**           | title                                 | string          | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `GET` /api/announcement/member/detail

**Operation:** `getAnnouncementDetails`

**Parameters**

| Name                  | Description                           | Type            | Location |
| :-------------------- | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \*   | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **announcementId** \* | announcementId                        | integer($int64) | query    |
| **teamId** \*         | teamId                                | integer($int64) | query    |

**Responses**

- **200 OK**

```json
{
  "announcementId": 0,
  "content": "string",
  "createdAt": "2025-12-14T18:04:03.047Z",
  "imageUrl": "string",
  "title": "string",
  "updatedAt": "2025-12-14T18:04:03.047Z",
  "writer": "string"
}
```

---

### `GET` /api/announcement/member/get-all

**Operation:** `getAllAnnouncements`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **teamId**          | teamId                                | integer($int64) | query    |

**Responses**

- **200 OK**

```json
[
  {
    "createAt": "2025-12-14T18:04:03.049Z",
    "id": 0,
    "title": "string"
  }
]
```

---

## Auth Controller

### `PUT` /auth/add-info

**Operation:** `kakao_additionalInfo`

**Parameters**

| Name              | Description   | Type    | Location |
| :---------------- | :------------ | :------ | :------- |
| **address**       | address       | string  | query    |
| **addressDetail** | addressDetail | string  | query    |
| **birthDate**     | birthDate     | string  | query    |
| **gender**        | gender        | string  | query    |
| **hasExperience** | hasExperience | boolean | query    |
| **level**         | level         | string  | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `GET` /auth/google/callback

**Operation:** `getGoogleAuthorizeCode`

**Parameters**

| Name        | Description | Type   | Location |
| :---------- | :---------- | :----- | :------- |
| **code** \* | code        | string | query    |

**Responses**

- **200 OK**
  - Example: `{}`

---

### `GET` /auth/google/get-url

**Operation:** `getGoogleUrl`

**Parameters**

- No parameters

**Responses**

- **200 OK**

```json
{
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}
```

---

### `POST` /auth/google/signin

**Operation:** `google_SignIn`

**Parameters**

| Name               | Description | Type   | Location |
| :----------------- | :---------- | :----- | :------- |
| **accessToken** \* | accessToken | string | query    |

**Responses**

- **200 OK**
  - Example: `{}`

---

### `GET` /auth/kakao/callback

**Operation:** `getKakaoAuthorizeCode`

**Parameters**

| Name        | Description | Type   | Location |
| :---------- | :---------- | :----- | :------- |
| **code** \* | code        | string | query    |

**Responses**

- **200 OK**
  - Example: `{}`

---

### `GET` /auth/kakao/get-url

**Operation:** `getKakaoUrl`

**Parameters**

- No parameters

**Responses**

- **200 OK**

```json
{
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}
```

---

### `POST` /auth/kakao/signin

**Operation:** `kakao_SignIn`

**Parameters**

| Name               | Description | Type   | Location |
| :----------------- | :---------- | :----- | :------- |
| **accessToken** \* | accessToken | string | query    |

**Responses**

- **200 OK**
  - Example: `{}`

---

### `POST` /auth/token/refresh

**Operation:** `refreshAccessToken`

**Parameters**

| Name                | Description  | Type   | Location |
| :------------------ | :----------- | :----- | :------- |
| **refreshToken** \* | refreshToken | string | query    |

**Responses**

- **200 OK**
  - Example: `{}`

---

## Join Team Controller

### `POST` /api/joinTeam/{teamId}

**Operation:** `joinTeam`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **requestDto** \*   | requestDto                            | body            | body     |
| **teamId** \*       | teamId                                | integer($int64) | path     |

**Request Body Example**

```json
{
  "address": "string",
  "age": 0,
  "gender": "string",
  "hasExperience": true,
  "joinReason": "string",
  "level": "string",
  "name": "string",
  "position": "string"
}
```

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `POST` /api/joinTeam/inviteCode

**Operation:** `joinTeamByInviteCode`

**Parameters**

| Name                | Description                           | Type   | Location |
| :------------------ | :------------------------------------ | :----- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string | header   |
| **inviteCode**      | inviteCode                            | string | query    |
| **position**        | position                              | string | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

## Member Controller

### `GET` /api/member/all-info

**Operation:** `getMemberAllInfo`

**Parameters**

| Name                | Description       | Type   | Location |
| :------------------ | :---------------- | :----- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string | header   |

**Responses**

- **200 OK**

```json
{
  "memberResponseDto": {
    "address": "string",
    "addressDetail": "string",
    "age": 0,
    "birthDate": "string",
    "create_At": "string",
    "email": "string",
    "gender": "string",
    "hasExperience": true,
    "level": "string",
    "loginMethod": "string",
    "memberId": 0,
    "name": "string",
    "phoneNum": "string",
    "profileUrl": "string",
    "update_At": "string"
  },
  "myPageTeamResponseDtoList": [
    {
      "favoriteTeam": true,
      "position": "string",
      "role": "string",
      "teamColor": "string",
      "teamId": 0,
      "teamImageUrl": "string",
      "teamName": "string"
    }
  ]
}
```

---

### `GET` /api/member/getUser

**Operation:** `getUser`

**Parameters**

| Name                | Description       | Type   | Location |
| :------------------ | :---------------- | :----- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string | header   |

**Responses**

- **200 OK**

```json
{
  "address": "string",
  "addressDetail": "string",
  "age": 0,
  "birthDate": "string",
  "create_At": "string",
  "email": "string",
  "gender": "string",
  "hasExperience": true,
  "level": "string",
  "loginMethod": "string",
  "memberId": 0,
  "name": "string",
  "phoneNum": "string",
  "profileUrl": "string",
  "update_At": "string"
}
```

---

### `PUT` /api/member/updatePassword

**Operation:** `updatePassword`

**Parameters**

| Name                | Description       | Type   | Location |
| :------------------ | :---------------- | :----- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string | header   |
| **requestDto** \*   | requestDto        | body   | body     |

**Request Body Example**

```json
{
  "newPassword": "string",
  "newPasswordConfirm": "string",
  "oldPassword": "string"
}
```

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `PUT` /api/member/updateUser

**Operation:** `updateUser`

**Parameters**

| Name                | Description       | Type   | Location |
| :------------------ | :---------------- | :----- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string | header   |
| **requestDto** \*   | requestDto        | body   | body     |

**Request Body Example**

```json
{
  "address": "string",
  "birtDate": "string",
  "gender": "string",
  "hasExperience": true,
  "level": "string",
  "phoneNum": "string"
}
```

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

## My Page Controller

### `PUT` /api/myPage/favoriteTeam/{teamId}

**Operation:** `checkFavoriteTeam`

**Parameters**

| Name                | Description       | Type            | Location |
| :------------------ | :---------------- | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string          | header   |
| **teamId** \*       | teamId            | integer($int64) | path     |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `DELETE` /api/myPage/leave/{teamId}

**Operation:** `leaveTeam`

**Parameters**

| Name                | Description       | Type            | Location |
| :------------------ | :---------------- | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string          | header   |
| **reason** \*       | reason            | body            | body     |
| **teamId** \*       | teamId            | integer($int64) | path     |

**Request Body Example**

```json
"string"
```

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `GET` /api/myPage/requests

**Operation:** `getJoinRequests`

**Parameters**

| Name                | Description       | Type   | Location |
| :------------------ | :---------------- | :----- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string | header   |

**Responses**

- **200 OK**

```json
[
  {
    "position": "string",
    "status": "string",
    "teamImageUrl": "string",
    "teamName": "string"
  }
]
```

---

### `PUT` /api/myPage/teamMember/{teamId}

**Operation:** `updateTeamMember`

**Parameters**

| Name                | Description       | Type            | Location |
| :------------------ | :---------------- | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string          | header   |
| **requestDto** \*   | requestDto        | body            | body     |
| **teamId** \*       | teamId            | integer($int64) | path     |

**Request Body Example**

```json
{
  "position": "string",
  "teamColor": "string"
}
```

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `GET` /api/myPage/teams

**Operation:** `getJoinedTeams`

**Parameters**

| Name                | Description       | Type   | Location |
| :------------------ | :---------------- | :----- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string | header   |

**Responses**

- **200 OK**

```json
[
  {
    "favoriteTeam": true,
    "position": "string",
    "role": "string",
    "teamColor": "string",
    "teamId": 0,
    "teamImageUrl": "string",
    "teamName": "string"
  }
]
```

---

## Search Team Controller

### `GET` /api/search/join-team

**Operation:** `searchJoinTeam`

**Parameters**

| Name                | Description       | Type          | Location |
| :------------------ | :---------------- | :------------ | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string        | header   |
| **ageRange**        | ageRange          | array[string] | query    |
| **teamGender**      | teamGender        | array[string] | query    |
| **teamLevel**       | teamLevel         | array[string] | query    |
| **teamRegion**      | teamRegion        | array[string] | query    |

**Responses**

- **200 OK**

```json
[
  {
    "matchLocation": "string",
    "memberCount": 0,
    "teamGender": "string",
    "teamId": 0,
    "teamImageUrl": "string",
    "teamName": "string"
  }
]
```

---

### `GET` /api/search/teamByInviteCode

**Operation:** `searchTeamByInviteCode`

**Parameters**

| Name                | Description       | Type   | Location |
| :------------------ | :---------------- | :----- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string | header   |
| **inviteCode**      | inviteCode        | string | query    |

**Responses**

- **200 OK**

```json
{
  "activitySchedule": [["string"]],
  "ageRange": "string",
  "dues": "string",
  "inviteCode": "string",
  "matchLocation": "string",
  "memberCount": 0,
  "positionRequired": ["string"],
  "region": "string",
  "teamGender": "string",
  "teamImageUrl": "string",
  "teamLevel": "string",
  "teamName": "string",
  "team_introduce": "string",
  "town": "string"
}
```

---

## Sign Controller

### `POST` /api/sign/change-password

**Operation:** `changePassword`

**Parameters**

| Name              | Description   | Type   | Location |
| :---------------- | :------------ | :----- | :------- |
| **newPassword**   | newPassword   | string | query    |
| **oldPassword**   | oldPassword   | string | query    |
| **oldPasswordCk** | oldPasswordCk | string | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `GET` /api/sign/checkEmail/{email}

**Operation:** `checkEmail`

**Parameters**

| Name         | Description | Type   | Location |
| :----------- | :---------- | :----- | :------- |
| **email** \* | email       | string | path     |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `POST` /api/sign/reissue

**Operation:** `reissue`

**Parameters**

| Name                | Description  | Type   | Location |
| :------------------ | :----------- | :----- | :------- |
| **refreshToken** \* | refreshToken | string | query    |

**Responses**

- **200 OK**

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

---

### `POST` /api/sign/send-sms

**Operation:** `sendSms`

**Parameters**

| Name         | Description | Type   | Location |
| :----------- | :---------- | :----- | :------- |
| **phoneNum** | phoneNum    | string | query    |

**Responses**

- **200 OK**

```json
{
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}
```

---

### `POST` /api/sign/sign-in

**Operation:** `SignIn`

**Parameters**

| Name         | Description | Type   | Location |
| :----------- | :---------- | :----- | :------- |
| **email**    | email       | string | query    |
| **password** | password    | string | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "newUser": true,
  "refreshToken": "string",
  "success": true,
  "token": "string"
}
```

---

### `POST` /api/sign/sign-up

**Operation:** `SignUp`

**Parameters**

| Name                          | Description               | Type    | Location |
| :---------------------------- | :------------------------ | :------ | :------- |
| **address**                   | address                   | string  | query    |
| **addressDetail**             | addressDetail             | string  | query    |
| **birthDate**                 | birthDate                 | string  | query    |
| **consentPersonalInfo**       | consentPersonalInfo       | boolean | query    |
| **consentServiceUser**        | consentServiceUser        | boolean | query    |
| **consentToReceivingMail**    | consentToReceivingMail    | boolean | query    |
| **consentToThirdPartyOffers** | consentToThirdPartyOffers | boolean | query    |
| **email**                     | email                     | string  | query    |
| **gender**                    | gender                    | string  | query    |
| **hasExperience**             | hasExperience             | boolean | query    |
| **level**                     | level                     | string  | query    |
| **name**                      | name                      | string  | query    |
| **password**                  | password                  | string  | query    |
| **passwordCheck**             | passwordCheck             | string  | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `POST` /api/sign/verify

**Operation:** `SignUpSmsVerify`

**Parameters**

| Name                    | Description         | Type   | Location |
| :---------------------- | :------------------ | :----- | :------- |
| **certificationNumber** | certificationNumber | string | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

## Team Controller

### `GET` /api/team/{teamId}

**Operation:** `getTeam`

**Parameters**

| Name                | Description       | Type            | Location |
| :------------------ | :---------------- | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string          | header   |
| **teamId** \*       | teamId            | integer($int64) | path     |

**Responses**

- **200 OK**

```json
{
  "activitySchedule": [["string"]],
  "ageRange": "string",
  "dues": "string",
  "inviteCode": "string",
  "matchLocation": "string",
  "memberCount": 0,
  "positionRequired": ["string"],
  "region": "string",
  "teamGender": "string",
  "teamImageUrl": "string",
  "teamLevel": "string",
  "teamName": "string",
  "team_introduce": "string",
  "town": "string"
}
```

---

### `GET` /api/team/{teamId}/memberList

**Operation:** `getTeamMemberList`

**Parameters**

| Name                | Description                                                         | Type            | Location |
| :------------------ | :------------------------------------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token                                                   | string          | header   |
| **sort** \*         | 정렬 (Available: 최신 가입순, 오래된 가입순 / Default: 최신 가입순) | string          | query    |
| **teamId** \*       | teamId                                                              | integer($int64) | path     |

**Responses**

- **200 OK**

```json
[
  {
    "name": "string",
    "position": "string",
    "profileUrl": "string",
    "role": "string",
    "teamMemberId": 0
  }
]
```

---

### `POST` /api/team/create

**Operation:** `createTeamJsonOnly`

**Parameters**

| Name                       | Description         | Type   | Location |
| :------------------------- | :------------------ | :----- | :------- |
| **X-AUTH-TOKEN** \*        | 사용자 인증 Token   | string | header   |
| **createTeamRquestDto** \* | createTeamRquestDto | body   | body     |

**Request Body Example**

```json
{
  "activitySchedule": [["string"]],
  "ageRange": "string",
  "dues": "string",
  "matchLocation": "string",
  "positionRequired": ["string"],
  "region": "string",
  "teamGender": "string",
  "teamLevel": "string",
  "teamName": "string",
  "team_introduce": "string",
  "town": "string"
}
```

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `POST` /api/team/upload/image

**Operation:** `uploadTeamImage`

**Parameters**

| Name                | Description       | Type   | Location |
| :------------------ | :---------------- | :----- | :------- |
| **X-AUTH-TOKEN** \* | 사용자 인증 Token | string | header   |
| **image** \*        | image             | file   | formData |

**Responses**

- **200 OK**

```json
"string"
```

---

## Team Strategy Controller

### `DELETE` /api/team-strategy/delete/formation

**Operation:** `deleteFormation`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **formationId**     | formationId                           | integer($int64) | query    |
| **teamId**          | teamId                                | integer($int64) | query    |

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `GET` /api/team-strategy/get-position/name

**Operation:** `getPositionListByName`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **positionName**    | positionName                          | string          | query    |
| **teamId**          | teamId                                | integer($int64) | query    |

**Responses**

- **200 OK**

```json
{
  "id": 0,
  "name": "string"
}
```

---

### `GET` /api/team-strategy/get-strategy/monthly

**Operation:** `getAllTeamStrategyMonthly`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **date** \*         | date                                  | string          | query    |
| **teamId**          | teamId                                | integer($int64) | query    |

**Responses**

- **200 OK**

```json
[
  {
    "id": 0,
    "matchEndTime": "string",
    "matchStartTime": "string",
    "opposingTeam": "string",
    "team": "string"
  }
]
```

---

### `GET` /api/team-strategy/get-strategy/monthly-day

**Operation:** `getTeamStrategyMonthly`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **date** \*         | date                                  | string($date)   | query    |
| **teamId**          | teamId                                | integer($int64) | query    |

**Responses**

- **200 OK**

```json
[
  {
    "id": 0,
    "matchEndTime": "string",
    "matchStartTime": "string",
    "opposingTeam": "string",
    "team": "string"
  }
]
```

---

### `GET` /api/team-strategy/get/formation

**Operation:** `getFormation`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **formationId** \*  | formationId                           | integer($int64) | query    |
| **teamId** \*       | teamId                                | integer($int64) | query    |

**Responses**

- **200 OK**

```json
{
  "formationDetailResponseDtoList": [
    {
      "detailPosition": "string",
      "id": 0,
      "playerName": "string",
      "x": 0,
      "y": 0
    }
  ],
  "id": 0,
  "positionName": "string"
}
```

---

### `GET` /api/team-strategy/get/team-member

**Operation:** `getTeamMemberByPosition`

**Parameters**

| Name                | Description                           | Type            | Location |
| :------------------ | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \* | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **position** \*     | position                              | string          | query    |
| **teamId** \*       | teamId                                | integer($int64) | query    |

**Responses**

- **200 OK**

```json
[
  {
    "id": 0,
    "name": "string",
    "position": "string"
  }
]
```

---

### `POST` /api/team-strategy/save/formation

**Operation:** `saveFormation`

**Parameters**

| Name                              | Description                           | Type            | Location |
| :-------------------------------- | :------------------------------------ | :-------------- | :------- |
| **X-AUTH-TOKEN** \*               | 로그인 성공 후 발급 받은 access_token | string          | header   |
| **formationDetailRequestDtos** \* | formationDetailRequestDtos            | body            | body     |
| **formationName** \*              | formationName                         | string          | query    |
| **teamId** \*                     | teamId                                | integer($int64) | query    |

**Request Body Example**

```json
[
  {
    "playerId": 0,
    "x": 0,
    "y": 0
  }
]
```

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

### `POST` /api/team-strategy/save/team-strategy

**Operation:** `saveMatchStrategy`

**Parameters**

| Name                    | Description                           | Type   | Location |
| :---------------------- | :------------------------------------ | :----- | :------- |
| **X-AUTH-TOKEN** \*     | 로그인 성공 후 발급 받은 access_token | string | header   |
| **matchStrategyDto** \* | matchStrategyDto                      | body   | body     |

**Request Body Example**

```json
{
  "address": "string",
  "formationId": 0,
  "matchDay": "string",
  "matchEndTime": "string",
  "matchStartTime": "string",
  "matchStrategy": "string",
  "opposingTeam": "string",
  "teamId": 0
}
```

**Responses**

- **200 OK**

```json
{
  "code": 0,
  "detailMessage": "string",
  "msg": "string",
  "success": true
}
```

---

## Test Controller

### `GET` /test/first

**Operation:** `first`

**Parameters**

- No parameters

**Responses**

- **200 OK**

```json
"string"
```

---

## Test D Controller

### `POST` /api/test-d/save

**Operation:** `saveInfo`

**Parameters**

| Name       | Description | Type | Location |
| :--------- | :---------- | :--- | :------- |
| **dto** \* | dto         | body | body     |

**Request Body Example**

```json
{
  "info": [{}]
}
```

**Responses**

- **200 OK**

```json
{
  "id": 0,
  "info": [{}]
}
```
