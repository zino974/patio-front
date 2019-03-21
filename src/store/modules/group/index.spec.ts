/*!
 * Copyright (C) 2019 Kaleidos Open Source SL
 *
 * This file is part of Dont Worry Be Happy (DWBH).
 * DWBH is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DWBH is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DWBH.  If not, see <https://www.gnu.org/licenses/>.
 */

import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import cloneDeep from "lodash.clonedeep";

import { generateGroup } from "@/__mocks__/data/groups";

import api, { ApiError } from "@/services/api";

import groupModule from "@/store/modules/group";

const getStore = () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  return new Vuex.Store({
    modules: {
      group: cloneDeep(groupModule),
    },
  });
};


describe("Group Store Module", () => {
  describe("Group Store Module: Mutations", () => {
    // get group
    describe("Mutation: getGgroupRequest", () => {
      it("change to pending state when 'get group' API request is started", () => {
        const store = getStore();

        store.commit("group/getGroupRequest");

        expect(store.getters["group/group"]).toEqual(undefined);
        expect(store.getters["group/getGroupIsLoading"]).toEqual(true);
        expect(store.getters["group/getGroupError"]).toEqual(false);
      });
    });
    describe("Mutation: getGroupSuccess", () => {
      it("change to success state when 'get group' API request finish successfully", () => {
        const store = getStore();
        const group = generateGroup();

        store.commit("group/getGroupSuccess", group);

        expect(store.getters["group/group"]).toEqual(group);
        expect(store.getters["group/getGroupIsLoading"]).toEqual(false);
        expect(store.getters["group/getGroupError"]).toEqual(false);
      });
    });
    describe("Mutation: getGroupFail", () => {
      it("change to error state when 'get group' API request fail", () => {
        const store = getStore();

        store.commit("group/getGroupFail", "ERROR");

        expect(store.getters["group/group"]).toEqual(undefined);
        expect(store.getters["group/getGroupIsLoading"]).toEqual(false);
        expect(store.getters["group/getGroupError"]).toEqual("ERROR");
      });
    });
  });

  describe("Group Store Module: Actions", () => {
    describe("Action: getGroup", () => {
      it("get a group successfuly", async () => {
        const store = getStore();
        const group = generateGroup();
        const input = { id: group.id };

        api.groups.get = jest.fn().mockResolvedValue(group);

        await store.dispatch("group/getGroup", input);

        expect(api.groups.get).toBeCalledTimes(1);
        expect(api.groups.get).toBeCalledWith(input);
        expect(store.getters["group/getGroupIsLoading"]).toEqual(false);
        expect(store.getters["group/getGroupError"]).toEqual(false);
      });
      it("get a group throw an error", async () => {
        const store = getStore();
        const group = generateGroup();
        const input = { id: group.id };

        api.groups.get = jest.fn().mockRejectedValue(new ApiError("ERROR"));

        await store.dispatch("group/getGroup", input);

        expect(api.groups.get).toBeCalledTimes(1);
        expect(api.groups.get).toBeCalledWith(input);
        expect(store.getters["group/getGroupIsLoading"]).toEqual(false);
        expect(store.getters["group/getGroupError"]).toEqual("ERROR");
      });
    });
  });
});