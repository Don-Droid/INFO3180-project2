/* Add your Application JavaScript */

Vue.component('app-header', {
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
                  <li class="nav-item active"> <router-link to="/" class="nav-link">My Profile</router-link>  </li>
                  <li class="nav-item active"> <router-link to="/" class="nav-link">Log out</router-link>  </li>
                  <li class="nav-item active"> <router-link to="/" class="nav-link">Log in</router-link>  </li>
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
    // display a success message
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
  template: `
  <div>
    <div class="form d-flex justify-content-center">
      <div class="posts">        
        <div v-for="post in posts" class="post_item" >
          <section class= "wrapper" id="conts">
              <div id="a1">
                <img :src = post.pphoto id="pic" alt="Profile photo">
              </div>
              <div id="b1">
              <router-link :to = "{name: 'user', params:{id:post.uid}}"> {{post.user}}</router-link>
              </div>
              <div id="a2">
                <img :src = post.photo id="pic" alt="photo">
              </div>
              <div id="a3">
                {{post.caption}} 
              </div>
              <div id="a4">
                <router-link :to = "{name: 'like', params:{id:post.pid}}"> Like </router-link>
              </div>
              <div id="d4">
                {{post.date}} 
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
      <div class="wrapper">      
        <div id="1a">
          <img :src = user.pphoto id="pic" alt="Profile photo">
        </div>
        <div id="1b">
          {{user.fname}}  {{user.lname}} 
        </div>
        <div id="1c">
        {{user.posts}} 
        </div>
        <div id="1d">
          {{user.follows}} 
        </div>
        <div id="2b">
          {{user.location}} 
          {{user.date}} 
        </div>
        <div id="2c">
          <h3>Post</h3> 
        </div>
        <div id="2d">
          <h3>Followers</h3> 
        </div>
        <div id="ar">
          <router-link :to = "{name: 'follow', params:{id:user.uid}}" class="btn btn-primary mb-2"> Follow </router-link>
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
      let nid = str.charAt(str.length-1); 

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

const Follow = Vue.component('follow', {
  props:['id'],
  template: `
  <div class="post-form center-block">   
    <div class="wrapper">      
      <div id="1a">
        <img :src = user.pphoto id="pic" alt="Profile photo">
      </div>
      <div id="1b">
        {{user.fname}}  {{user.lname}} 
      </div>
      <div id="1c">
      {{user.posts}} 
      </div>
      <div id="1d">
        {{user.follows}} 
      </div>
      <div id="2b">
        {{user.location}} 
        {{user.date}} 
      </div>
      <div id="2c">
        <h3>Post</h3> 
      </div>
      <div id="2d">
        <h3>Followers</h3> 
      </div>
      <div id="3c">
        <router-link to="/" class="btn btn-success mb-2" id="ar">Following</router-link> 
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
      let nid = str.charAt(str.length-1);
      console.log(nid);
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

const Like = Vue.component('like', {
  template: `
  <div>
    <div class="form-inline d-flex justify-content-center" id="cont">
      <div class="posts">        
        <div v-for="post in posts" class="post_item" >
          <section class= "wrappers" id="conts">
              <div id="a1">
                <img :src = post.pphoto id="pic" alt="Profile photo">
              </div>
              <div id="b1">
              <router-link :to = "{name: 'user', params:{id:post.uid}}"> {{post.user}}</router-link>
              </div>
              <div id="a2">
                <img :src = post.photo id="pic" alt="photo">
              </div>
              <div id="a3">
                {{post.caption}} 
              </div>
              <div id="a4">
                <router-link :to = "{name: 'like', params:{id:post.uid}}"> Like </router-link>
              </div>
              <div id="d4">
                {{post.date}} 
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
      console.log(pid);
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
      posts: []
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
    {path: "*", component: NotFound}
    ]
});

const app = new Vue({
  el: '#app', 
    router,
    data: {
      token:  ''
        }
    
});
