import { NextApiResponse, NextApiRequest } from "next"

export default (req: NextApiRequest, res: NextApiResponse) => {
    const users = [
        {key: 1, nome: 'William'},
        {key: 2, nome: 'Vinicius'},
        {key: 3, nome: 'Marquito'}
    ];

    return res.json(users)
}