/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserData } from './types';
import { SignupPage } from './components/signup/SignupPage';
import { ChatPage } from './components/chat/ChatPage';

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);

  if (!user) {
    return <SignupPage onSignup={setUser} />;
  }

  return <ChatPage user={user} />;
}
