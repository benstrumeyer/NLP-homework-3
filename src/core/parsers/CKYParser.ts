import {PCFG} from "../grammar/PCFG";
import {CKYCell, PossibleParse} from "../models/CKYCell";
import {PCFGTree} from "../models/PCFGTree";

export class CKYParser
{
    private grammar:PCFG;
    private table:CKYCell[][];

    constructor(grammar:PCFG)
    {
        this.grammar = grammar;
    }

    public parse(sequence:string):PCFGTree
    {
        var words = sequence.split(/\s+/g);

        // This is the diagonal initializing loop
        for (let i = 0; i < words.length; i++)
        {
            // Find all the rules that have the right hand side as the word i.
            let word = words[i];

            // Find all the rules in the grammar with word on the right side.
            let cell = this.initializeCell(word);

            this.table[i][i] = cell;
        }

        // Let's fill up every other cell
        for (let j = 0; j < words.length; j++)
        {
            for (let i = j - 1; i >= 0; i--)
            {
                this.processTableCell(i, j);
            }
        }
                
        // Gotta return the final parsed tree
        return null;
    }

    private processTableCell(i:number, j:number)
    {
        var table = this.table;
        var currentCell = table[i][j];

        var possibleParses = currentCell.parses;
        for (let k = i; k < j; k++)
        {
            let rowCell = table[i][k];
            let colCell = table[k+1][j];

            // Here find all the possible parses that come from the row cells and col cells
            possibleParses.concat(this.findPossibleParses(rowCell, colCell,i ,j ,k ,this.grammar));
            // Might be k - 1


        }
    }

    private findPossibleParses(rowCell:CKYCell, colCell:CKYCell, i:number, j:number, k:number, grammar:PCFG):PossibleParse[]
    {
        var possibleParses = [];

        // Find all possible parses X, that has X -> rowCell.any() colCell.any()
        for (let rowParse of rowCell.parses)
        {
            for (let colParse of colCell.parses)
            {
                var rhs = [rowParse.nonTerminal, colParse.nonTerminal];
                var rule = this.grammar.findRuleByRHS(rhs);
                // Skip if LHS was not found
                if(!rule)
                    continue;

                // If found, make a possible parse and add it
                var possibleParse = new PossibleParse(rule.left);
                var score = this.table[i][j].scorePossibleParses(this.table, i, j, k, possibleParse, rule);

                possibleParse.score = score;
                possibleParses.push(possibleParse);
            }
        }

        this.table[i][j].pruneNonOptimalParses(this.table, i, j);

        return possibleParses;
    }

    private initializeCell(word:string):CKYCell
    {
        var rules = this.grammar.rules;

        var matchingRules = rules
            .filter(rule => rule.isUnary() && rule.right[0] === word);

        var parses = matchingRules
            .map(rule => new PossibleParse(rule.left, rule.probability));

        return new CKYCell(parses);
    }
}