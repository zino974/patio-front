<!--
 Copyright (C) 2019 Kaleidos Open Source SL

 This file is part of Dont Worry Be Happy (DWBH).
 DWBH is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 DWBH is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with DWBH.  If not, see <https://www.gnu.org/licenses/>.
-->

<template src="./CreateGroup.pug" lang="pug"></template>
<style src="./CreateGroup.css" scoped></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { CreateGroupInput } from "@/services/api/types";

import GroupForm from "@/components/shared/GroupForm/GroupForm.vue";

const GroupsStore = namespace("groups");
const AuthStore = namespace("auth");

@Component({
  components: {
    "dw-group-form": GroupForm,
  },
})
export default class CreateGroup extends Vue {
  @GroupsStore.Getter("createGroupIsLoading")
  private isLoading!: boolean;

  @GroupsStore.Getter("createGroupError")
  private error!: boolean | string;

  @GroupsStore.Action("createGroup")
  private createGroup: any;

  @AuthStore.Action("getMyProfile")
  private refreshProfile: any;

  private async handleCreateGroupSubmit(input: CreateGroupInput) {
    const group = await this.createGroup(input);
    await this.refreshProfile({force: true});

    if (group) {
      this.$router.push({ name: "team", params: { groupId: group.id } });
    }
  }
}
</script>
