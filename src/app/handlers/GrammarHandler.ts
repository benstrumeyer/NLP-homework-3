import {FileWorker} from "../../core/FileWorker";
import {Preprocess} from "../../core/Preprocess";
import {GrammarBuilder} from "../../core/builders/GrammarBuilder";
import {_HandlerBase} from "./_HandlerBase";

export class GrammarHandler
{
    public static rebuild()
    {
        _HandlerBase.grammar = GrammarBuilder.buildGrammarFromTrainingData();
    }
}