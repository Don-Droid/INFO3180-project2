/* Add your Application JavaScript */

Vue.component('app-header', {
  props: {
    login: Boolean
  },
    template: `
        <header>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
              <div style="padding:5px"> <i class="fa fa-camera"></i> </div> 
              <a class="navbar-brand" href="#" style="font-style: italic; font-weight: bold;"> Photogram</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ml-auto">
                  <li class="nav-item active"> <router-link to="/" class="nav-link">Home</router-link> </li>
                  <li class="nav-item active"> <router-link to="/explore" class="nav-link">Explore</router-link>  </li>
                  <li class="nav-item active"> <router-link to="/profile" class="nav-link">My Profile</router-link>  </li>
                  <li class="nav-item active"> <router-link to="/logout" class="nav-link">Log out</router-link>  </li>
                </ul>
              </div>
            </nav>
        </header>    
    `,
    data: function() {
      return {};
    }
});

const Home = Vue.component('home', {
  template: `
    <div class="home">
      <div id="left">
        <img src="/static/images/camera.jpg" alt="Camera">
      </div>
      <div id="right">
        <h2 style="font-style: italic; font-weight: bold">Photogram</h2>
        <hr>
        <p>{{ welcome }}</p>
        <div>                 
          <router-link to="/register" class="btn btn-secondary mb-2">Register</router-link>
          <router-link to="/login" class="btn btn-primary mb-2">Login</router-link>             
        </div>
      </div>
    </div>
`,
data: function() {
return {
welcome: 'Share photos of your favourite moments with friends, family and the world.'
}
}
});

const Register = Vue.component('register-form', {
  template: `
  <div>
    <div class="d-flex justify-content-center">   
      <h2>Registration</h2>
    </div>   
    <br>
    <div class="register-form d-flex justify-content-center">     
      <div class="wrapper">      
        <form id="registerForm" method="POST" @submit.prevent="uploadForm" class="form-data" enctype="multipart/form-data">          
          <div class="form-group">
            <label for="uname">Username:</label><br>
            <input type="text" id="uname" name="uname" class="form-control"><br>

            <label for="pword">Password:</label><br>
            <input type="password" id="pword" name="pword" class="form-control"><br>

            <label for="fname">First Name:</label><br>
            <input type="text" id="fname" name="fname" class="form-control"><br>

            <label for="lname">Last Name:</label><br>
            <input type="text" id="lname" name="lname" class="form-control"><br>

            <label for="email">Email:</label><br>
            <input type="text" id="email" name="email" class="form-control"><br>

            <label for="location">Location:</label><br>
            <input type="text" id="location" name="location" class="form-control"><br>

            <label for="bio">Biography:</label><br>
            <textarea name="bio" id="bio" class="form-control"></textarea><br>
          
            <label for="photo">Photo</label><br>
            <input type="file" id="photo" name="photo" class="form-control">
          </div>
          <input type="submit" name="submit" class="btn btn-primary btn-block" value="Register">
        </form>
      </div>
    </div>      
  </div>    
  `,
  methods:{
    uploadForm: function(){
      let registerForm = document.getElementById('registerForm');
      let form_data = new FormData(registerForm);
      fetch("http://localhost:8080/api/users/register", {
        method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                    },
                    credentials: 'same-origin'
      })
      .then(function (response) {
        return response.json();
    })
    .then(function (jsonResponse) {
        console.log(jsonResponse);
        window.location.replace('http://localhost:8080')
    })
    .catch(function (error) {
        console.log(error);
    });
    }
  }
});

const Login = Vue.component('login', {
  template: `
  <div>
    <div class="d-flex justify-content-center">
      <h2>Login</h2> 
    </div>
    <br>
    <div class="login-form d-flex justify-content-center">   
      <div class="wrapper">      
        <form id="loginForm" method="POST" @submit.prevent="uploadForm" class="form-data" enctype="multipart/form-data">          
          <div class="form-group">
            <label for="uname">Username:</label><br>
            <input type="text" id="uname" name="uname" class="form-control"><br>

            <label for="pword">Password:</label><br>
            <input type="password" id="pword" name="pword" class="form-control"><br>
          </div>
          <input type="submit" name="submit" class="btn btn-primary btn-block" value="Login">
        </form>
      </div>
    </div> 
  </div> 
  `,
  methods:{
    uploadForm: function(){
      let loginForm = document.getElementById('loginForm');
      let form_data = new FormData(loginForm);
      fetch("http://localhost:8080/api/auth/login", {
        method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                    },
                    credentials: 'same-origin'
      })
      .then(function (response) {
        return response.json();
    })
    .then(function (jsonResponse) {
    // display a success message
         console.log(jsonResponse);
         let response = jsonResponse.login[0]['message'];         
         if (response == "Login Successfully") {
            let jwttoken = jsonResponse.login[1]['token'];
            localStorage.setItem('token', jwttoken);
            self.token = jwttoken;
            window.location.replace('http://localhost:8080/explore')
         } else {
           console.log(response)
         }
        
    })
    .catch(function (error) {
        console.log(error);
    });
    }
  }
});

const Explore = Vue.component('explore', {
  props: {
    like: Boolean,
    login: Boolean
  },
  template: `
  <div>
    <div class="form d-flex justify-content-center">
      <div class="posts" v-bind="login=true" >      
        <div v-for="post in posts" v-bind="like=post.like" class="post_item" >
         
          <section id="conts" v-if="login">
              <p > </p>
              <div id="a1">
                <img :src = post.pphoto id="pic" alt="Profile photo">
              </div>
              <div id="b1">
              <router-link :to = "{name: 'user', params:{id:post.uid}}"> {{post.user}}</router-link>
              </div>
              <div id="a2pic">
                <img :src = post.photo  alt="photo" id="p">
              </div>
              <div id="a3">
                {{post.caption}} 
              </div>
              <div id="a4" v-if="like">
                like
              </div>
              <div id="a4" v-else>
                <router-link :to = "{name: 'like', params:{id:post.pid}}"> <i class="fa fa-thumbs-up"></i> </router-link>
              </div>
              <div id="d4">
                {{post.date}} 
              </div>
              <div id="b4">
                <p>Likes {{post.likes}}</p> 
              </div>  
          </section>
          <br>
          <div>
            <router-link to="/post" class="btn btn-primary mb-2" id="ar">New Post</router-link> 
          </div>
        </div> 
      </div> 
          
    </div>
  </div>
  `,
  created: function(){
    let self = this;
      fetch('http://localhost:8080/api/posts', {
        method: 'GET',
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('token')}`
                    },
                    credentials: 'same-origin'
      })
      .then(function (response) {
        return response.json();
    })
    .then(function (data) {
    // display a success message
        console.log(data);
        self.posts = data.data
    })
    .catch(function (error) {
        console.log(error);
    });
  },
  data: function() {
    return {
      posts: []
  }
}
});

const User = Vue.component('user_profile', {
  template: `
    <div class="post-form center-block">   
      <section id="conts2">      
        <div id="b1a">
          <img :src = user.pphoto id="pics" alt="Profile photo">
        </div>
        <div id="b1b">
          {{user.fname}}  {{user.lname}} 
        </div>
        <div id="b1c">
        {{user.posts}} 
        </div>
        <div id="b1d">
          {{user.follows}} 
        </div>
        <div id="b2b">
          {{user.location}} <br>
          {{user.date}} 
        </div>
        <div id="b2c">
          <h5>Post</h5> 
        </div>
        <div id="b2d">
          <h5>Followers</h5> 
        </div>
        <div id="b3b">
          {{user.bio}} 
        </div>
        <div id="b3c">
          <router-link :to = "{name: 'follow', params:{id:user.uid}}" class="btn btn-primary mb-2"> Follow </router-link>
        </div>
        <div id="b3c" v-if="follow">
          <button class="btn btn-success mb-2" > Following </button>
        </div>
      </section>
    </div>  
  `,
  created: function(){
    let self = this;
    function getValueAtIndex(index){
      var str = window.location.href; 
      return str.split("/")[index];
    }
      let str = (getValueAtIndex(3));
      let nid = str.substring(4); 

    let url = ("/api/users/"+nid+"/posts");
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `bearer ${localStorage.getItem('token')}`
        },
        credentials: 'same-origin'
      })
      .then(function (response) {
        return response.json();
    })
    .then(function (data) {
    // display a success message
        console.log(data);
        self.user = data.d
        self.follow = data.d.following
        self.id = data.d.uid
        
    })
    .catch(function (error) {
        console.log(error);
    });
  },
  data: function() {
    return {
      user: [],
      follow: null,
      id:null
    }
  }
});

const Follow = Vue.component('follow', {
  props:['id'],
  template: `
  <div class="post-form center-block">   
      <section id="conts2">      
        <div id="b1a">
          <img :src = user.pphoto id="pics" alt="Profile photo">
        </div>
        <div id="b1b">
          {{user.fname}}  {{user.lname}} 
        </div>
        <div id="b1c">
        {{user.posts}} 
        </div>
        <div id="b1d">
          {{user.follows}} 
        </div>
        <div id="b2b">
          {{user.location}} <br>
          {{user.date}} 
        </div>
        <div id="b2c">
          <h5>Post</h5> 
        </div>
        <div id="b2d">
          <h5>Followers</h5> 
        </div>
        <div id="b3b">
          {{user.bio}} 
        </div>
        <div id="b3c">
          <button class="btn btn-success mb-2" > Following </button>
        </div>
      </section>
    </div> 
  `,
  created: function(){
    let self = this;
    function getValueAtIndex(index){
      var str = window.location.href; 
      return str.split("/")[index];
    }
      let str = (getValueAtIndex(3));
      let nid = str.substring(9);
    let url = (`http://localhost:8080/api/users/${nid}/follow`);
    fetch(url, {
      method: 'POST',
              headers: {
                  'Authorization': `bearer ${localStorage.getItem('token')}`,
                  'Content-Length': 0,
                  'X-CSRFToken': token
                  },
                credentials: 'same-origin'
    })
    .then(function (response) {
      return response.json();
  })
  .then(function (data) {
  // display a success message
      console.log(data);
      self.user = data.d
      self.follow = data.d.following
      self.id = data.d.uid
  })
  .catch(function (error) {
      console.log(error);
  });
},
  data: function() {
    return {
      user: [],
      follow: null,
      id:null
  }
}
});

const Like = Vue.component('like', {
  props: {
    like: Boolean
  },
  template: `
  <div>
    <div class="form d-flex justify-content-center">
      <div class="posts">      
        <div v-for="post in posts" class="post_item" >
          <p v-bind="like=post.like"> </p>
          <section id="conts">
              <div id="a1">
                <img :src = post.pphoto id="pic" alt="Profile photo">
              </div>
              <div id="b1">
              <router-link :to = "{name: 'user', params:{id:post.uid}}"> {{post.user}}</router-link>
              </div>
              <div id="a2pic">
                <img :src = post.photo  alt="photo" id="p">
              </div>
              <div id="a3">
                {{post.caption}} 
              </div>
              <div id="a4" v-if="like == true">
                like
              </div>
              <div id="a4" v-else>
                <router-link :to = "{name: 'like', params:{id:post.pid}}"> Not Like </router-link>
              </div>
              <div id="d4">
                {{post.date}} 
              </div>
              <div id="b4">
                <p>Likes {{post.likes}}</p> 
              </div>  
          </section>
          <br>
        </div>
      </div> 
      <div>
        <router-link to="/post" class="btn btn-primary mb-2" id="ar">New Post</router-link> 
      </div>     
    </div>
  </div>
  `,
  created: function(){
    let self = this;
    function getValueAtIndex(index){
      var str = window.location.href; 
      return str.split("/")[index];
    }
      let str = (getValueAtIndex(3));
      let pid = str.charAt(str.length-1);
      fetch(`http://localhost:8080/api/posts/${pid}/like`, {
        method: 'POST',
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('token')}`,
                    'X-CSRFToken': token
                    },
                    credentials: 'same-origin'
      })
      .then(function (response) {
        return response.json();
    })
    .then(function (data) {
    // display a success message
        console.log(data);
        self.posts = data.data
    })
    .catch(function (error) {
        console.log(error);
    });
  },
  data: function() {
    return {
      posts: [],
    

  }
}
});

const Posts = Vue.component('post-form', {
  template: `
  <div class="post-form d-flex justify-content-center">   
      <div class="wrapper">      
        <form id="postForm" method="POST" @submit.prevent="uploadForm" class="form-data" enctype="multipart/form-data">          
          <div class="form-group">
            <label for="photo">Photo</label><br>
            <input type="file" id="photo" name="photo" class="form-control"><br>
            <label for="bio">Caption</label><br>
            <textarea name="caption" id="caption" class="form-control"></textarea><br>
          </div>
          <input type="submit" name="submit" class="btn btn-primary btn-block" value="Submit">
        </form>
    </div>
  </div>  
  `,
  methods:{
    uploadForm: function(){
      let postForm = document.getElementById('postForm');
      let form_data = new FormData(postForm);

      const parseJwt = (token) => {
        try {
          return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          return null;
        }
      };
      
      const userId = (parseJwt(localStorage.getItem('token'))).user_Id;
      console.log(userId);
      let url = "/api/users/"+userId+"/posts";

      fetch(url, {
        method: 'POST',
                body: form_data,
                headers: {
                  'X-CSRFToken': token
                    },
                    credentials: 'same-origin'
      })
      .then(function (response) {
        return response.json();
    })
    .then(function (jsonResponse) {
    // display a success message
        console.log(jsonResponse);
        window.location.replace('http://localhost:8080/explore')        
    })
    .catch(function (error) {
        console.log(error);
    });
    }
  }
});

const Profile = Vue.component('my-profile', {
  template:`
  <div class="profile d-flex justify-content-center" v-bind="login=true">   
      <section class="conts3" v-if="login">
      <div id="ca1">
        {{user.user}}
      </div>
      <div id="ca2">
        <img :src = user.pphoto id="pics" alt="Profile photo">
        <br>
        <hr>
      </div>
      
      <div id="ca3">
        <hr>
        Name:  {{user.fname}}  {{user.lname}} 
      </div>
      <div id="ca4">
        Email: {{user.email}} 
      </div>
      <div id="ca5">
        Location: {{user.location}} 
      </div>
      <div id="cb3">
      <hr>
        Following: {{user.following}} 
      </div>
      <div id="cb4">
        Followers: {{user.followers}} 
      </div>
      <div id="cb5">
        {{user.date}} 
      </div>
      <div id="ca6">
      <hr>
        Biography: {{user.bio}} 
      </div>
      </section>
  </div>  
  `,
  created: function(){
    let self = this;
      fetch('http://localhost:8080/api/profile', {
        method: 'GET',
                headers: {
                    'Authorization': `bearer ${localStorage.getItem('token')}`
                    },
                    credentials: 'same-origin'
      })
      .then(function (response) {
        return response.json();
    })
    .then(function (data) {
    // display a success message
        console.log(data);
        self.user = data.d
    })
    .catch(function (error) {
        console.log(error);
  });
  },
  data: function() {
    return {
    user: []
    }
  }
});

const Logout = Vue.component('logout', {
  template: `
  `,
    created: function () {
      localStorage.removeItem('token');
      window.location.replace('http://localhost:8080');
  }
  
  
})

Vue.component('app-footer', {
  template: `
      <footer>
          <div class="container">
              <p>Copyright &copy {{ year }} Photogram Inc.</br>
              By Robin Kerr and Raldon Baxter</p>
          </div>
      </footer>
  `,
  data: function() {
      return {
          year: (new Date).getFullYear()
      }
  }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
});

const router = new VueRouter({
  mode: 'history',
    routes: [
    { path: '/', component: Home },
    { path: '/register', component: Register},
    {path: '/login', component: Login},
    {path: '/explore', component: Explore},
    {path: '/post', component: Posts},
    {path: '/user:id', component: User, name: 'user'},
    {path: '/following:id', component: Follow, name: 'follow', props: true},
    {path: '/like:id', component: Like, name: 'like'},
    {path: '/profile', component: Profile},
    {path: '/logout', component: Logout},
    {path: "*", component: NotFound}
    ]
});

const app = new Vue({
  el: '#app', 
    router,
    data: {
      token:  '',
        }
    
});
