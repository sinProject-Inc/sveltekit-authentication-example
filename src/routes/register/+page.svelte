<script lang="ts">
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<h1>Register</h1>

<form method="POST">
	<input type="text" name="username" placeholder="Username" required value={form?.username ?? ''} />
	<input type="email" name="email" placeholder="email" required value={form?.email ?? ''} />
	<input type="password" name="password" placeholder="Password" required />

	{#if form?.missing}<p class="error">Username, email and password are required.</p>{/if}
	{#if form?.user_exists}<p class="error">Username or email is used.</p>{/if}

	<input type="submit" value="Register" />
</form>
