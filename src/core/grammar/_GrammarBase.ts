import {GrammarRule} from "../models/GrammarRule";
import {TreeParser} from "../parsers/TreeParser";
import {PCFGTree} from "../models/PCFGTree";
import {TreeNode} from "../models/TreeNode";

export abstract class _GrammarBase
{
    public rules:GrammarRule[];

    public train(unparsedTrees:string)
    {
        var treeLines = unparsedTrees.split(/\n/g);

        //for (let tree of treeLines)
        //{
            let parsedTree = TreeParser.parseTree(treeLines[0]);
            let rules = this.convertTreeToRules(parsedTree);

            this.rules = rules;
        //}

        console.log(this.rules);
    }

    private convertTreeToRules(tree:PCFGTree):GrammarRule[]
    {
        var root = tree.root;

        return this.parseTreeNodes(root);
    }

    private parseTreeNodes(node:TreeNode):GrammarRule[]
    {
        if(node.isTerminal())
            return [];

        var rules:GrammarRule[] = [];

        var left = node.data;
        var right = node.children.map(child => child.data);

        rules.push(new GrammarRule(left, right));

        var childrenRules = node.children
            .map(child => this.parseTreeNodes(child))
            .reduce((left, right) => left.concat(right));

        return rules.concat(childrenRules);
    }
}