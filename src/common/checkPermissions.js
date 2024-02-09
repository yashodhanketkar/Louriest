/**
 * @param {InteractionType} interaction
 * @param {string | string[]} permissions
 * @returns {Promise<boolean>}
 */
module.exports.checkPermission = async function checkPermission(
  interaction,
  permissions
) {
  if (typeof permissions === "string") {
    return await interaction.member
      .permissionsIn(interaction.channel)
      .has(permissions);
  }

  for (let permission of permissions) {
    const havePermission = await interaction.member
      .permissionsIn(interaction.channel)
      .has(permission);
    if (!havePermission) {
      return false;
    }
  }
  return true;
};
