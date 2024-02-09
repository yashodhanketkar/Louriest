/**
 * Check if a member has the specified permissions for a given interaction.
 *
 * @param {InteractionType} interaction - The Discord interaction object.
 * @param {string | string[]} permissions - The permission(s) to check. Can be a single or an array of permission(s).
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the member has all specified permissions, and `false` otherwise.
 */
module.exports.checkPermission = async function checkPermission(
  interaction,
  permissions
) {
  // If permissions is a string, check for a single permission.
  if (typeof permissions === "string") {
    return await interaction.member
      .permissionsIn(interaction.channel)
      .has(permissions);
  }

  // If permissions is an array, check for each permission.
  for (let permission of permissions) {
    const havePermission = await interaction.member
      .permissionsIn(interaction.channel)
      .has(permission);

    // If any permission is missing, return false.
    if (!havePermission) {
      return false;
    }
  }
  // If all permissions are present, return true.
  return true;
};
