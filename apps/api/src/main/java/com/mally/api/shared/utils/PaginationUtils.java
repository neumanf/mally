package com.mally.api.shared.utils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import org.hibernate.query.sqm.tree.SqmCopyContext;
import org.hibernate.query.sqm.tree.predicate.SqmPredicate;
import org.springframework.data.domain.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class PaginationUtils {

    public static <E> Page<E> paginateSearch(final EntityManager entityManager,
                                             final Class<E> entityClass,
                                             final List<String> searchFields,
                                             final String searchQuery,
                                             final String userId,
                                             final Pageable pageable) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<E> query = builder.createQuery(entityClass);
        Root<E> root = query.from(entityClass);
        Sort.Order sort = pageable.getSort().toList().getFirst();

        List<Predicate> predicates = new ArrayList<>();

        searchFields.forEach(field ->
                predicates.add(builder.like(builder.lower(root.get(field)), "%" + searchQuery.toLowerCase() + "%")));

        query
                .select(root)
                .where(
                    builder.and(
                        builder.equal(root.get("userId"), userId),
                        builder.or(predicates.toArray(new Predicate[0]))
                    )
                )
                .orderBy(sort.getDirection().equals(Sort.Direction.ASC)
                        ? builder.asc(root.get(sort.getProperty()))
                        : builder.desc(root.get(sort.getProperty()))
                );

        List<E> result = entityManager.createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        long count = PaginationUtils.count(entityManager, builder, query, root);

        return new PageImpl<>(result, pageable, count);
    }

    public static <E, D> long count(final EntityManager entityManager,
                                    final CriteriaBuilder cb,
                                    final CriteriaQuery<D> criteria,
                                    final Root<E> root) {
        CriteriaQuery<Long> query = createCountQuery(cb, criteria, root, root.getModel().getJavaType());
        return entityManager.createQuery(query).getSingleResult();
    }

    private static <T, D> CriteriaQuery<Long> createCountQuery(final CriteriaBuilder cb,
                                                               final CriteriaQuery<D> criteria,
                                                               final Root<T> root,
                                                               final Class<T> entityClass) {

        final CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        final SqmCopyContext copyContext = SqmCopyContext.simpleContext();
        final Root<T> countRoot = countQuery.from(entityClass);
        copyContext.registerCopy(root, countRoot);

        doJoins(root.getJoins(), countRoot, copyContext);
        doJoinsOnFetches(root.getFetches(), countRoot, copyContext);

        countQuery.select(cb.count(countRoot));
        countQuery.where(((SqmPredicate) criteria.getRestriction()).copy(copyContext));

        countRoot.alias(root.getAlias());

        return countQuery.distinct(criteria.isDistinct());
    }

    @SuppressWarnings("unchecked")
    private static void doJoinsOnFetches(Set<? extends Fetch<?, ?>> joins, Root<?> root, SqmCopyContext copyContext) {
        doJoins((Set<? extends Join<?, ?>>) joins, root, copyContext);
    }

    private static void doJoins(Set<? extends Join<?, ?>> joins, Root<?> root, SqmCopyContext copyContext) {
        for (Join<?, ?> join : joins) {
            Join<?, ?> joined = root.join(join.getAttribute().getName(), join.getJoinType());
            joined.alias(join.getAlias());
            copyContext.registerCopy(join, joined);
            doJoins(join.getJoins(), joined, copyContext);
        }
    }

    private static void doJoins(Set<? extends Join<?, ?>> joins, Join<?, ?> root, SqmCopyContext copyContext) {
        for (Join<?, ?> join : joins) {
            Join<?, ?> joined = root.join(join.getAttribute().getName(), join.getJoinType());
            joined.alias(join.getAlias());
            copyContext.registerCopy(join, joined);
            doJoins(join.getJoins(), joined, copyContext);
        }
    }

    public static Pageable buildPageable(int pageNumber, int pageSize, String orderBy, String sortBy) {
        return PageRequest.of(pageNumber, pageSize, Sort.by(orderBy.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy));
    }
}
