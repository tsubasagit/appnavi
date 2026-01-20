# Firebaseセキュリティルール（コピー＆ペースト用）

## 使用方法

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト `appnavi-add7e` を選択
3. 左メニューから **Firestore Database** を選択
4. **ルール** タブをクリック
5. 以下のルール全体をコピーして、既存のルールを置き換えてください
6. **公開** ボタンをクリック

---

## 開発環境用ルール（firestore.rules）

```javascript
rules_version = '2';
service cloud.firestore {
  // ⚠️ 警告: このファイルは開発環境用です
  // 本番環境では firestore.rules.production を使用してください
  // このファイルには移行用の一時的な緩和ルール（!resource.data.ownerId）が含まれています
  // 本番環境で使用するとセキュリティリスクがあります
  
  // ヘルパー関数: ユーザーが組織のメンバーかどうかをチェック
  function isOrganizationMember(orgId, userId) {
    let org = get(/databases/$(database)/documents/organizations/$(orgId));
    return org != null && (
      org.data.ownerId == userId ||
      userId in org.data.memberIds
    );
  }
  
  // ヘルパー関数: ユーザーがアプリにアクセス可能かどうかをチェック
  function canAccessApp(appId, userId) {
    let app = get(/databases/$(database)/documents/apps/$(appId));
    return app != null && (
      app.data.ownerId == userId ||
      (app.data.organizationId != null && isOrganizationMember(app.data.organizationId, userId)) ||
      !app.data.ownerId // ownerIdがない既存アプリは読み込み可能（移行用）
    );
  }
  
  // ヘルパー関数: テストユーザーIDかどうかをチェック（開発環境用）
  function isTestUserId(userId) {
    return userId == 'test-user-tsubasa';
  }
  
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみ読み書き可能
    // 開発環境: テストユーザーIDも許可
    match /users/{userId} {
      allow read, write: if 
        (request.auth != null && request.auth.uid == userId) ||
        (request.auth == null && isTestUserId(userId));
      
      // アプリは新しいパス構造: users/{uid}/apps/{appId}
      // パスベースで自動的にフィルタリングされるため、シンプルで安全
      match /apps/{appId} {
        // 読み書き: 本人のみ（パスベースで自動的に保護される）
        // 開発環境: テストユーザーIDも許可
        allow read, write: if 
          (request.auth != null && request.auth.uid == userId) ||
          (request.auth == null && isTestUserId(userId));
        
        match /pages/{pageId} {
          // 親アプリの読み書き権限と同じ
          allow read, write: if 
            (request.auth != null && request.auth.uid == userId) ||
            (request.auth == null && isTestUserId(userId));
        }
        
        match /dataSources/{sourceId} {
          // 親アプリの読み書き権限と同じ
          allow read, write: if 
            (request.auth != null && request.auth.uid == userId) ||
            (request.auth == null && isTestUserId(userId));
        }
        
        match /deployments/{deployId} {
          // 親アプリの読み書き権限と同じ
          allow read, write: if 
            (request.auth != null && request.auth.uid == userId) ||
            (request.auth == null && isTestUserId(userId));
        }
        
        match /integrations/{integrationId} {
          // 秘匿情報（SheetsのURLやトークンなど）はさらに厳格に管理
          allow read, write: if 
            (request.auth != null && request.auth.uid == userId) ||
            (request.auth == null && isTestUserId(userId));
        }
      }
    }
    
    // 旧パス構造（apps/{appId}）の後方互換性のため、移行期間中は残す
    // ⚠️ 注意: 本番環境では削除するか、より厳格なルールに変更してください
    match /apps/{appId} {
      // 読み込み: オーナーまたは組織メンバーのみ、またはownerIdがない既存アプリ（移行用）
      // 注意: クエリを実行する際は、where('ownerId', '==', userId)の条件を満たす必要がある
      // 開発環境: テストユーザーIDも許可
      allow read: if (
        (request.auth != null && (
          resource.data.ownerId == request.auth.uid || // ownerIdでクエリする場合
          canAccessApp(appId, request.auth.uid) || // 個別ドキュメントアクセスの場合
          (!resource.data.ownerId) // ownerIdがない既存アプリは読み込み可能（移行用）
        )) ||
        (request.auth == null && isTestUserId(resource.data.ownerId)) // テストユーザーの場合
      );
      
      // 書き込み: オーナーのみ（新規作成時も含む）、またはownerIdがない既存アプリの更新（移行用）
      // 開発環境: テストユーザーIDも許可（request.authがnullでも、ownerIdがテストユーザーIDの場合は許可）
      // 開発用の緩和: 認証済みであれば作成を許可（ownerIdが未設定でも通す）
      // 本番では ownerId チェックを必須にすること
      allow create: if (
        (request.auth != null && request.auth.uid == request.resource.data.ownerId) ||
        (request.auth != null) || // 開発環境での利便性向上（任意の認証ユーザーに許可）
        (request.auth == null && isTestUserId(request.resource.data.ownerId))
      );
      allow update: if (
        (request.auth != null && (
          resource.data.ownerId == request.auth.uid ||
          (!resource.data.ownerId && request.resource.data.ownerId == request.auth.uid) // ownerIdがない既存アプリにownerIdを追加可能（移行用）
        )) ||
        (request.auth == null && isTestUserId(resource.data.ownerId))
      );
      allow delete: if (
        (request.auth != null && resource.data.ownerId == request.auth.uid) ||
        (request.auth == null && isTestUserId(resource.data.ownerId))
      );
      
      match /pages/{pageId} {
        // 親アプリの読み込み権限と同じ
        // 開発環境: テストユーザーIDも許可
        allow read: if (
          (request.auth != null && (
            canAccessApp(appId, request.auth.uid) ||
            (!get(/databases/$(database)/documents/apps/$(appId)).data.ownerId) // ownerIdがない既存アプリは読み込み可能（移行用）
          )) ||
          (request.auth == null && isTestUserId(get(/databases/$(database)/documents/apps/$(appId)).data.ownerId))
        );
        allow write: if (
          (request.auth != null && (
            get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid ||
            (!get(/databases/$(database)/documents/apps/$(appId)).data.ownerId) // ownerIdがない既存アプリは書き込み可能（移行用）
          )) ||
          (request.auth == null && isTestUserId(get(/databases/$(database)/documents/apps/$(appId)).data.ownerId))
        );
      }
      
      match /dataSources/{sourceId} {
        // 親アプリの読み込み権限と同じ
        // アプリのownerIdを直接チェック（canAccessApp関数を使用すると循環依存になる可能性があるため）
        // 開発環境: テストユーザーIDも許可
        allow read: if (
          (request.auth != null && (
            get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid ||
            (!get(/databases/$(database)/documents/apps/$(appId)).data.ownerId) // ownerIdがない既存アプリは読み込み可能（移行用）
          )) ||
          (request.auth == null && isTestUserId(get(/databases/$(database)/documents/apps/$(appId)).data.ownerId))
        );
        
        // 書き込み: 親アプリのオーナーのみ
        allow create: if (
          (request.auth != null && (
            get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid ||
            (!get(/databases/$(database)/documents/apps/$(appId)).data.ownerId) // ownerIdがない既存アプリは書き込み可能（移行用）
          )) ||
          (request.auth == null && isTestUserId(get(/databases/$(database)/documents/apps/$(appId)).data.ownerId))
        );
        allow update, delete: if (
          (request.auth != null && (
            get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid ||
            (!get(/databases/$(database)/documents/apps/$(appId)).data.ownerId) // ownerIdがない既存アプリは書き込み可能（移行用）
          )) ||
          (request.auth == null && isTestUserId(get(/databases/$(database)/documents/apps/$(appId)).data.ownerId))
        );
      }
      
      match /deployments/{deployId} {
        // 親アプリの読み込み権限と同じ
        // 開発環境: テストユーザーIDも許可
        allow read: if (
          (request.auth != null && (
            canAccessApp(appId, request.auth.uid) ||
            (!get(/databases/$(database)/documents/apps/$(appId)).data.ownerId) // ownerIdがない既存アプリは読み込み可能（移行用）
          )) ||
          (request.auth == null && isTestUserId(get(/databases/$(database)/documents/apps/$(appId)).data.ownerId))
        );
        allow write: if (
          (request.auth != null && (
            get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid ||
            (!get(/databases/$(database)/documents/apps/$(appId)).data.ownerId) // ownerIdがない既存アプリは書き込み可能（移行用）
          )) ||
          (request.auth == null && isTestUserId(get(/databases/$(database)/documents/apps/$(appId)).data.ownerId))
        );
      }
    }
    
    // 組織はメンバーまたはオーナーのみ読み書き可能
    match /organizations/{orgId} {
      // 読み込み: メンバーまたはオーナーのみ
      // クエリを実行する際は、where('memberIds', 'array-contains', userId)の条件を満たす必要がある
      allow read: if request.auth != null && (
        resource.data.ownerId == request.auth.uid || // ownerIdでクエリする場合
        request.auth.uid in resource.data.memberIds || // memberIdsでクエリする場合（array-contains）
        isOrganizationMember(orgId, request.auth.uid) // 個別ドキュメントアクセスの場合
      );
      allow write: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;
    }
    
    // プラグインとテンプレートは公開されているものは全員読み込み可能
    match /plugins/{pluginId} {
      allow read: if resource.data.isPublic == true || 
        (request.auth != null && resource.data.vendorId == request.auth.uid);
      allow write: if request.auth != null && 
        resource.data.vendorId == request.auth.uid;
    }
    
    match /templates/{templateId} {
      // 読み込み: 公開されているテンプレートは全員読み込み可能
      // 非公開テンプレートは、作成者（vendorId）のみ読み込み可能
      // 開発環境: テストユーザー（request.auth == null）も公開テンプレートを読み込み可能
      // ドキュメントが存在しない場合も許可（getDocでnullが返るだけ）
      allow read: if 
        !exists(/databases/$(database)/documents/templates/$(templateId)) || // ドキュメントが存在しない場合
        resource.data.isPublic == true || // 公開されているテンプレート
        (request.auth != null && resource.data.vendorId == request.auth.uid) || // 作成者は自分のテンプレートを読み込み可能
        (request.auth == null && resource.data.isPublic == true); // 開発環境: テストユーザーも公開テンプレートを読み込み可能
      
      // 書き込み: 管理者のみ、またはベンダーが自分のテンプレートのみ
      // ⚠️ 開発環境用の緩和ルール（true）を削除しました
      allow write: if request.auth != null && (
        // 管理者はすべてのテンプレートを書き込み可能
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
        // ベンダーは自分のテンプレートのみ書き込み可能（vendorIdが一致する場合）
        (resource.data.vendorId != null && resource.data.vendorId == request.auth.uid) ||
        // 新規作成時: ベンダーは自分のvendorIdを設定したテンプレートのみ作成可能
        (request.resource.data.vendorId != null && request.resource.data.vendorId == request.auth.uid)
      );
    }
    
    // システム設定は管理者のみ
    match /system_settings/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // フィードバックは全員が作成可能、管理者のみ読み込み可能
    match /feedback/{feedbackId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // お知らせは全員が読み込み可能、管理者のみ書き込み可能
    match /announcements/{announcementId} {
      // 読み込み: 認証済みユーザーは全員が読み込み可能、またはアクティブなお知らせは未認証でも読み込み可能
      // クエリの場合: 認証済みユーザーは全員が読み込み可能
      // ドキュメント取得の場合: 認証済みユーザーまたはアクティブなお知らせは全員が読み込み可能
      allow read: if 
        request.auth != null || 
        (resource != null && resource.data.isActive == true);
      
      // 書き込み: 管理者のみ
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // お知らせコレクション全体のクエリを許可（認証済みユーザーは全員がクエリ可能）
    match /announcements/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

---

## 本番環境用ルール（firestore.rules.production）

本番環境では以下のルールを使用してください（開発環境用の緩和ルールを削除したバージョン）：

```javascript
rules_version = '2';
service cloud.firestore {
  // ヘルパー関数: ユーザーが組織のメンバーかどうかをチェック
  function isOrganizationMember(orgId, userId) {
    let org = get(/databases/$(database)/documents/organizations/$(orgId));
    return org != null && (
      org.data.ownerId == userId ||
      userId in org.data.memberIds
    );
  }
  
  // ヘルパー関数: ユーザーがアプリにアクセス可能かどうかをチェック
  function canAccessApp(appId, userId) {
    let app = get(/databases/$(database)/documents/apps/$(appId));
    return app != null && (
      app.data.ownerId == userId ||
      (app.data.organizationId != null && isOrganizationMember(app.data.organizationId, userId))
    );
  }
  
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみ読み書き可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // アプリは新しいパス構造: users/{uid}/apps/{appId}
      // パスベースで自動的にフィルタリングされるため、シンプルで安全
      match /apps/{appId} {
        // 読み書き: 本人のみ（パスベースで自動的に保護される）
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        match /pages/{pageId} {
          // 親アプリの読み書き権限と同じ
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        
        match /dataSources/{sourceId} {
          // 親アプリの読み書き権限と同じ
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        
        match /deployments/{deployId} {
          // 親アプリの読み書き権限と同じ
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        
        match /integrations/{integrationId} {
          // 秘匿情報（SheetsのURLやトークンなど）はさらに厳格に管理
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
    
    // 旧パス構造（apps/{appId}）は本番環境では削除推奨
    // 移行期間中のみ残す
    match /apps/{appId} {
      allow read: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        canAccessApp(appId, request.auth.uid)
      );
      allow create, update, delete: if request.auth != null && resource.data.ownerId == request.auth.uid;
      
      match /pages/{pageId} {
        allow read, write: if request.auth != null && canAccessApp(appId, request.auth.uid);
      }
      
      match /dataSources/{sourceId} {
        allow read, write: if request.auth != null && 
          get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid;
      }
      
      match /deployments/{deployId} {
        allow read, write: if request.auth != null && 
          get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid;
      }
    }
    
    // 組織はメンバーまたはオーナーのみ読み書き可能
    match /organizations/{orgId} {
      allow read: if request.auth != null && isOrganizationMember(orgId, request.auth.uid);
      allow write: if request.auth != null && 
        resource.data.ownerId == request.auth.uid;
    }
    
    // プラグインとテンプレートは公開されているものは全員読み込み可能
    match /plugins/{pluginId} {
      allow read: if resource.data.isPublic == true || 
        (request.auth != null && resource.data.vendorId == request.auth.uid);
      allow write: if request.auth != null && 
        resource.data.vendorId == request.auth.uid;
    }
    
    match /templates/{templateId} {
      // 読み込み: 公開されているテンプレートは全員読み込み可能
      // 非公開テンプレートは、作成者（vendorId）のみ読み込み可能
      allow read: if 
        resource.data.isPublic == true || // 公開されているテンプレート
        (request.auth != null && resource.data.vendorId == request.auth.uid); // 作成者は自分のテンプレートを読み込み可能
      
      // 書き込み: 管理者のみ、またはベンダーが自分のテンプレートのみ
      allow write: if request.auth != null && (
        // 管理者はすべてのテンプレートを書き込み可能
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
        // ベンダーは自分のテンプレートのみ書き込み可能（vendorIdが一致する場合）
        (resource.data.vendorId != null && resource.data.vendorId == request.auth.uid) ||
        // 新規作成時: ベンダーは自分のvendorIdを設定したテンプレートのみ作成可能
        (request.resource.data.vendorId != null && request.resource.data.vendorId == request.auth.uid)
      );
    }
    
    // システム設定は管理者のみ
    match /system_settings/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // フィードバックは全員が作成可能、管理者のみ読み込み可能
    match /feedback/{feedbackId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // お知らせは全員が読み込み可能、管理者のみ書き込み可能
    match /announcements/{announcementId} {
      allow read: if 
        request.auth != null || 
        (resource != null && resource.data.isActive == true);
      
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 主な変更点

### ✅ 新しいパス構造の追加
- `users/{userId}/apps/{appId}` に対応
- パスベースで自動的にフィルタリング
- `integrations` サブコレクションを追加（秘匿情報用）

### ✅ 開発環境用の緩和ルール削除
- `templates` の書き込みルールから `true` を削除
- 管理者またはベンダーのみ書き込み可能

### ✅ 後方互換性
- 旧パス構造（`apps/{appId}`）のルールは移行期間中は残しています
- 本番環境では削除推奨

---

## デプロイ後の確認

1. Firebaseコンソールでルールが正しくデプロイされているか確認
2. アプリケーションで新しいパス構造（`users/{uid}/apps/{appId}`）が正常に動作するか確認
3. 旧パス構造（`apps/{appId}`）のデータが正常に動作するか確認（移行期間中）
