const getIdFromUser = async function (username) {
  const options = {
    method: 'POST',
    url: 'https://users.roblox.com/v1/usernames/users',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usernames: [username],
      excludeBannedUsers: true,
    }),
  };

  try {
    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};

const getUserPFP = async function (userId) {
  const options = {
    method: 'GET',
    url: `https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`,
    headers: {
      accept: 'application/json',
    },
  };

  try {
    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
    });

    const responseData = await response.json();
    return responseData.data[0]?.imageUrl;
  } catch (error) {
    throw error;
  }
};

export { getIdFromUser, getUserPFP };
