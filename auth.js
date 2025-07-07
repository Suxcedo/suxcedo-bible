const supa = supabase.createClient(
  'https://bojsjxlolzxwvueiuviv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvanNqeGxvbHp4d3Z1ZWl1dml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODM1NTQsImV4cCI6MjA2NzQ1OTU1NH0.kqdHP7uxhBaPUShoYODzeNKHbfj_u7b8rocQ-tvOsGg'
);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  const signupBox = document.getElementById("signup-box");
  const confirmBox = document.getElementById("confirmation-box");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;
    const username = form.username.value.trim();

    if (!username) {
      alert("Please enter a username.");
      return;
    }

    // 👇 Use supa here now
    const { data: signUpData, error: signUpError } = await supa.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      alert("Signup failed: " + signUpError.message);
      return;
    }

    const userId = signUpData.user.id;

    const { error: profileError } = await supa
      .from('profiles')
      .insert([{ id: userId, username, role: 'user' }]);

    if (profileError) {
      alert("Could not save user profile.");
      return;
    }

    // Show fancy confirmation message
    signupBox.style.display = "none";
    confirmBox.style.display = "block";
  });
});
