/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState , useEffect} from 'react';
import { UserData } from './types';
import { SignupPage } from './components/signup/SignupPage';
import { ChatPage } from './components/chat/ChatPage';

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);

   useEffect(() => {
    const token = localStorage.getItem("chat_token");
    const email = localStorage.getItem("chat_email");
    const username = localStorage.getItem("chat_username");
    const avatar = localStorage.getItem("chat_avatar");
     


    if (token && email && username ) {
      setUser({ token, email , username , avatar });
      console.log( token, email , username , avatar )

    }



  }, []);


  if (!user) {
    return <SignupPage onSignup={setUser} />;
  }

  return <ChatPage 
    user={user}  onLogout={() => {
    localStorage.clear();
    setUser(null);
  }}/>;
}
