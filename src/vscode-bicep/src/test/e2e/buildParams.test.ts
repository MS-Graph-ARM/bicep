// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import fs from "fs";
import path from "path";
import vscode from "vscode";
import { sleep } from "../../utils/time";

import { executeBuildParamsCommand, executeCloseAllEditors } from "./commands";
import { resolveExamplePath } from "./examples";

describe("buildParams", (): void => {
  afterEach(async () => {
    await executeCloseAllEditors();
  });

  it("should generate compiled file if the source file has no errors", async () => {
    const examplePath = resolveExamplePath("201", "sql", "main.bicepparam");
    const textDocument = await vscode.workspace.openTextDocument(examplePath);

    // Give the language server some time to finish compilation.
    await sleep(2000);

    await executeBuildParamsCommand(textDocument.uri);

    const folderContainingSourceFile = path.dirname(examplePath);
    const compiledFilePath = path.join(
      folderContainingSourceFile,
      "main.parameters.json"
    );

    expect(fs.existsSync(compiledFilePath)).toBe(true);

    // Delete the generated compiled file
    fs.unlinkSync(compiledFilePath);
  });
});
