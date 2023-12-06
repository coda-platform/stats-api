import { pathAndPathElement } from "../../../src/domain/queries/pathAndPathElement";
import fieldPathDecomposedObjectMother from "../../utils/objectMothers/domain/queries/fieldPathDecomposedObjectMother";

describe('fieldPathDecomposed tests', () => {
    it('field path one element, path and element returned the same', () => {
        // ARRANGE
        const fieldPathDecomposed = fieldPathDecomposedObjectMother.get('gender');
        expect(fieldPathDecomposed.length).toEqual(1);

        // ACT
        const pathAndElement = fieldPathDecomposed.next();

        // ASSERT
        expect(fieldPathDecomposed.length).toEqual(0);
        expectPathAndElementToEqual(pathAndElement.value, 'gender', 'gender');
    });

    it('field path one element, path and element with some uppercase, casing remains the same', () => {
        // ARRANGE
        const fieldPathDecomposed = fieldPathDecomposedObjectMother.get('Gender');
        expect(fieldPathDecomposed.length).toEqual(1);

        // ACT
        const pathAndElement = fieldPathDecomposed.next();

        // ASSERT
        expect(fieldPathDecomposed.length).toEqual(0);
        expectPathAndElementToEqual(pathAndElement.value, 'Gender', 'Gender');
    });

    it('field path two elements, path is composed and elements are decomposed', () => {
        // ARRANGE
        const fieldPathDecomposed = fieldPathDecomposedObjectMother.get('address.city');
        expect(fieldPathDecomposed.length).toEqual(2);

        const pathAndElementA = fieldPathDecomposed.next();
        expect(fieldPathDecomposed.length).toEqual(1);

        // ACT
        const pathAndElementB = fieldPathDecomposed.next();

        // ASSERT
        expect(fieldPathDecomposed.length).toEqual(0);
        expectPathAndElementToEqual(pathAndElementA.value, 'address', 'address');
        expectPathAndElementToEqual(pathAndElementB.value, 'address.city', 'city');
    });

    it('field path two elements, path and element with some uppercase, casing remains the same', () => {
        // ARRANGE
        const fieldPathDecomposed = fieldPathDecomposedObjectMother.get('Address.City');
        const pathAndElementA = fieldPathDecomposed.next();

        // ACT
        const pathAndElementB = fieldPathDecomposed.next();

        // ASSERT
        expectPathAndElementToEqual(pathAndElementA.value, 'Address', 'Address');
        expectPathAndElementToEqual(pathAndElementB.value, 'Address.City', 'City');
    });

    it('field path two elements, can iterate threw elements', () => {
        // ARRANGE
        const fieldPathDecomposed = fieldPathDecomposedObjectMother.get('address.city');
        const pathAndElements = new Array<{ path: string, pathElement: string }>();

        // ACT
        for (const pathAndElement of fieldPathDecomposed) {
            pathAndElements.push(pathAndElement);
        }

        // ASSERT
        expect(fieldPathDecomposed.length).toEqual(0);

        expectPathAndElementToEqual(pathAndElements[0], 'address', 'address');
        expectPathAndElementToEqual(pathAndElements[1], 'address.city', 'city');
    });

    it('field path two elements, to array, returns array with both path elements', () => {
        // ARRANGE
        const fieldPathDecomposed = fieldPathDecomposedObjectMother.get('address.city');

        // ACT
        const fieldPathsArray = fieldPathDecomposed.toArray();

        // ASSERT
        expect(fieldPathsArray.length).toEqual(2);
        expectPathAndElementToEqual(fieldPathsArray[0], 'address', 'address');
        expectPathAndElementToEqual(fieldPathsArray[1], 'address.city', 'city');
    });

    function expectPathAndElementToEqual(pathAndElement: pathAndPathElement, path: string, pathElement: string) {
        expect(path).toEqual(pathAndElement.path);
        expect(pathElement).toEqual(pathAndElement.pathElement);
    }
});