/* SPDX-License-Identifier: GPL-3.0-or-later
 * 
 * A pointless Firebot v5 script for locally displaying various alerts, notifications, messages, and the like.
 * 
 * Copyright (C) 2024 phroggie / phroggster
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import {
  SCRIPT_DESCRIPTION,
  SCRIPT_NAME,
  SCRIPT_VERSION,
} from "./consts";
import { registerEffects } from "./effects";
import { registerEvents } from "./events";
import { registerModules } from "./script-modules";

const script: Firebot.CustomScript = {
  getScriptManifest: () => {
    return {
      name: SCRIPT_NAME,
      description: SCRIPT_DESCRIPTION,
      version: SCRIPT_VERSION,
      author: "phroggie",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => { return {}; },
  run: (runRequest) => {
    const { logger } = runRequest.modules;

    try {
      logger.debug(`${SCRIPT_NAME} script initializing…`);

      registerModules(runRequest.modules);
      registerEffects();
      registerEvents();

      logger.debug(`${SCRIPT_NAME} script initialised successfully!`);

      return {
        success: true,
        errorMessage: null,
        effects: []
      };
    }
    catch (anyError) {
      const error = anyError as Error;
      let errMessage = `Unknown error during initialization: ${JSON.stringify(anyError)}`;
      if (error) {
        logger.warn(`${SCRIPT_NAME} generated an '${error.name}' error during initialization and will not be available for use: ${error.message}`, error);
        errMessage = error.message;
      }
      return {
        success: false,
        errorMessage: errMessage,
        effects: []
      };
    }
  },
};

export default script;
